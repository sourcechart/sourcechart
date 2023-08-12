/*
The DuckDB client is how we instantiate the Duckdb WASM database inside the browser.

This system works via making a database out of a webpack that is statically loaded into browser,
and then hydration is run through thefileStreamer and DuckDBWasm Client.  Given that the files
are larger, we have to load it into the database in batches. This process is not optimized yet 
but will be starting in the coming days.

// Adapted from https://observablehq.com/@cmudig/duckdb-client
// Copyright 2021 CMU Data Interaction Group
*/

import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import type { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';
import { FileStreamer } from './FileStreamer';
import { checkNameForSpacesandHyphens } from './FileUtils';

type Buffer = ArrayBuffer | Uint8Array;

export class DuckDBClient {
	_db: AsyncDuckDB | null = null;
	_conn?: duckdb.AsyncDuckDBConnection | null = null;

	constructor(db: AsyncDuckDB) {
		Object.defineProperties(this, {
			_db: { value: db }
		});
	}

	public async queryStream(query: string, params?: Array<any>) {
		if (this._db) {
			const connection = await this._db.connect();
			let reader: any;
			let batch: any;
			try {
				//@ts-ignore
				if (params?.length > 0) {
					const statement = await connection.prepare(query); //@ts-ignore
					reader = await statement.send(...params);
				} else {
					reader = await connection.send(query);
				}
				batch = await reader.next();
				if (batch.done) throw new Error('missing first batch');
			} catch (error) {
				await connection.close();
				throw error;
			}
			return {
				schema: getArrowTableSchema(batch.value),
				async *readRows() {
					try {
						while (!batch.done) {
							yield batch.value.toArray();
							batch = await reader.next();
						}
					} finally {
						await connection.close();
					}
				}
			};
		}
	}

	public async query(query: string, params?: Array<any>): Promise<Array<any[any]>> {
		/*
		Query the duckdb database via a query string.
		
		Args
		----
		query: string
			Query string
		 
		 
		Returns
		-------
		Promise <Array<any[any]>>
		*/
		const res = await this.queryStream(query, params);
		let results: Array<any> = []; //@ts-ignore
		for await (const rows of res.readRows()) {
			for (const row of rows) {
				results.push(row);
			}
		} //@ts-ignore
		results.schema = res.schema;
		return results;
	}

	public async queryRow(query: string, params?: Array<any>) {
		/*Query a single row*/
		const result = await this.queryStream(query, params); //@ts-ignore
		const reader = result.readRows();
		try {
			const { done, value } = await reader.next();
			return done || !value.length ? null : value[0];
		} finally {
			await reader.return();
		}
	}

	async sql(strings: Array<string>, ...args: Array<any>) {
		//Get SQL String
		return await this.query(strings.join('?'), args);
	}

	public queryTag(strings: Array<string>, ...params: Array<any>) {
		//Get the Query Tag
		return [strings.join('?'), params];
	}

	public escape(name: string | number) {
		return `"${name}"`;
	}

	public async describeTables() {
		const tables = await this.query(`SHOW TABLES`);
		return tables.map(({ name }) => ({ name }));
	}

	//@ts-ignore
	public async describeColumns(table: string) {
		const columns = await this.query(`DESCRIBE ${this.escape(table)}`);
		return columns.map(({ column_name, column_type, null: nullable }) => ({
			name: column_name,
			type: getDuckDBType(column_type),
			nullable: nullable !== 'NO',
			databaseType: column_type
		}));
	}

	static async of(sources = {}, config = {}) {
		//if (!this._db) {
		const db: AsyncDuckDB | null = await makeDB(); // If this db does not exist initialize the db
		//@ts-ignore
		if (config.query?.castTimeStampToDate === undefined) {
			//@ts-ignore
			config = { ...config, query: { ...config.query, castTimeStampToDate: true } };
		}
		//@ts-ignore
		if (config.query?.castBigIntToDouble === undefined) {
			//@ts-ignore
			config = { ...config, query: { ...config.query, castBigIntToDouble: true } };
		}
		await db.open(config);
		await Promise.all(
			Object.entries(sources).map(async ([name, source]) => {
				//@ts-ignore
				if (source instanceof File) {
					await insertLargeOrDeformedFile(db, source);
				} else if (source instanceof Buffer) {
					await insertArrayBuffer(db, name, source); //@ts-ignore
				} else if ('file' in source) {
					const { file, ...options } = source; //@ts-ignore
					await insertFile(db, source.name, file, options);
				} else {
					throw new Error(`invalid source: ${source}`);
				}
			})
		);
		return new DuckDBClient(db);
	}
}

async function insertArrayBuffer(db: AsyncDuckDB, name: string, buffer: ArrayBuffer) {}

async function insertLargeOrDeformedFile(db: AsyncDuckDB, file: File) {
	let firstRun: boolean = true;
	var filetype = file.name.substring(file.name.lastIndexOf('.'));
	var reader = getDuckDbExtension(filetype);

	const fileStreamer = new FileStreamer(file);
	const connection = await db.connect();
	var filename = checkNameForSpacesandHyphens(file.name);
	while (!fileStreamer.isEndOfBlob()) {
		const uint8ArrayBuffer = await fileStreamer.readBlockAsArrayBuffer(); //@ts-ignore
		await db.registerFileBuffer(file.name, uint8ArrayBuffer);
		if (firstRun) {
			let query = `CREATE TABLE IF NOT EXISTS ${filename} AS 
							SELECT * FROM ${reader}('${file.name}', ignore_errors=1, AUTO_DETECT=true)
						LIMIT 0`;
			await connection.query(query);
			firstRun = false;
		}
		try {
			await connection.query(`
				INSERT INTO ${filename}
					SELECT * FROM ${reader}('${file.name}',  AUTO_DETECT=true, ignore_errors=1);
			`);
		} catch (e) {
			console.log(e);
		}
	}

	return connection;
}

async function insertFileBuffer(db: AsyncDuckDB, name: string, buffer: ArrayBuffer) {}

async function insertFile(db: AsyncDuckDB, name: any, file: File, options?: any) {
	const buffer = await file.arrayBuffer();
	await db.registerFileBuffer(file.name, new Uint8Array(buffer));
	const connection = await db.connect();

	try {
		switch (file.type) {
			case 'text/csv':
			case 'text/tab-seperated-values': {
				return await connection
					.insertCSVFromPath(file.name, {
						name,
						schema: 'main',
						...options
					})
					.catch(async (error) => {
						if (error.toString().includes('Could Not Convert')) {
							return await insertUntypedCSV(connection, file, name);
						}
						throw error;
					});
			}
			case 'application/json':
				return await connection.insertJSONFromPath(file.name, { name, schema: 'main', ...options });
			default: {
				if (/\.parquet$/i.test(file.name)) {
					return await connection.query(
						`CREATE VIEW '${name}' AS SELECT * FROM parquet_scan('${file.name}')`
					);
				}
				throw new Error(`unknown file type: ${file.type}`);
			}
		}
	} finally {
		await connection.close();
	}
}

const makeDB = async () => {
	/*
	Make DB from the webapp from web assembly worke

	Returns
	-------
	Async duckdb

	*/
	const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
		mvp: {
			mainModule: duckdb_wasm,
			mainWorker: mvp_worker
		},
		eh: {
			mainModule: duckdb_wasm_eh,
			mainWorker: eh_worker
		}
	};
	// Select a bundle based on browser checks
	const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
	// Instantiate the asynchronus version of DuckDB-wasm
	const worker = new Worker(bundle.mainWorker!);
	const logger = new duckdb.ConsoleLogger();
	const db = new duckdb.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
	return db;
};

function getArrowTableSchema(table: any): Field {
	return table.schema.fields.map(getArrowFieldSchema);
}

function getArrowFieldSchema(field: Field): Field {
	return {
		name: field.name,
		type: getArrowType(field.type),
		nullable: field.nullable,
		databaseType: String(field.type)
	};
}

function isArrowTable(value: any) {
	return (
		value &&
		typeof value.getChild === 'function' &&
		typeof value.toArray === 'function' &&
		value.schema &&
		Array.isArray(value.schema.fields)
	);
}

function getArrowType(type: { typeId: number }) {
	switch (type.typeId) {
		case 2: // Int
			return 'integer';
		case 3: // Float
		case 7: // Decimal
			return 'number';
		case 4: // Binary
		case 15: // FixedSizeBinary
			return 'buffer';
		case 5: // Utf8
			return 'string';
		case 6: // Bool
			return 'boolean';
		case 8: // Date
		case 9: // Time
		case 10: // Timestamp
			return 'date';
		case 12: // List
		case 16: // FixedSizeList
			return 'array';
		case 13: // Struct
		case 14: // Union
			return 'object';
		case 11: // Interval
		case 17: // Map
		default:
			return 'other';
	}
}

// https://duckdb.org/docs/sql/data_types/overview
function getDuckDBType(type: string) {
	switch (type) {
		case 'BIGINT':
		case 'HUGEINT':
		case 'UBIGINT':
			return 'bigint';
		case 'DOUBLE':
		case 'REAL':
		case 'FLOAT':
			return 'number';
		case 'INTEGER':
		case 'SMALLINT':
		case 'TINYINT':
		case 'USMALLINT':
		case 'UINTEGER':
		case 'UTINYINT':
			return 'integer';
		case 'BOOLEAN':
			return 'boolean';
		case 'DATE':
		case 'TIMESTAMP':
		case 'TIMESTAMP WITH TIME ZONE':
			return 'date';
		case 'VARCHAR':
		case 'UUID':
			return 'string';
		// case "BLOB":
		// case "INTERVAL":
		// case "TIME":
		default:
			if (/^DECIMAL\(/.test(type)) return 'integer';
			return 'other';
	}
}

async function remote_fetch(file: any) {
	const response = await fetch(await file.url());
	if (!response.ok) throw new Error(`Unable to load file: ${file.name}`);
	return response;
}

async function insertUntypedCSV(connection: AsyncDuckDBConnection, file: File, name: string) {
	const statement = await connection.prepare(
		`CREATE TABLE '${name}' AS SELECT * FROM read_csv_auto(?, ALL_VARCHAR=TRUE)`
	);
	return await statement.send(file.name);
}

function getDuckDbExtension(filetype: string) {
	let reader_format;
	if (filetype === '.csv') {
		reader_format = 'read_csv_auto';
	} else if (filetype === '.parquet') {
		reader_format = 'read_parquet';
	}
	return reader_format;
}
