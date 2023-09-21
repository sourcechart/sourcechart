<script context="module" lang="ts">
	import sqlite3InitModule, { type Sqlite3 } from 'sqlite-wasm-esm';
	import { DuckDBClient } from './DuckDBClient';

	const dbFileName = 'LocalDB';
	const tableName = 'datastash';
	let globalDb: any;

	onmessage = async (e: MessageEvent) => {
		const messageData: DataMessage = e.data;

		switch (messageData.message) {
			case 'initializeDB':
				startDB();
				break;

			case 'createTable':
				createDatabaseTable();
				break;

			case 'closeDB':
				closeDB();
				break;

			case 'insert':
				insertDataIntoDatabase(messageData);
				break;

			case 'query':
				getBinaryFromDatabase(messageData);
				break;

			case 'delete':
				deleteDataFromDatabase(messageData);
				break;

			default:
				postMessage({ error: 'Invalid command' });
		}
	};

	const createDatabaseTable = (): void => {
		sqlite3InitModule().then(async (sqlite3) => {
			//@ts-ignore
			const db = new sqlite3.opfs.OpfsDb(dbFileName, 'c');
			db.exec(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                filename TEXT,
                data BLOB,
                id TEXT,
                size INTEGER,
                filetype TEXT,
                shardIndex INTEGER,
                UNIQUE(filename, shardIndex)
            );
        `);
			db.close();
		});
	};

	const startDB = (): void => {
		sqlite3InitModule().then(async (sqlite3) => {
			openDB(sqlite3);
		});
	};

	const getBinaryFromDatabase = (data: DataMessage) => {
		sqlite3InitModule().then(async (sqlite3) => {
			const res = globalDb.exec(`SELECT * FROM ${tableName} WHERE filename= '${data.filename}'`, {
				returnValue: 'resultRows'
			});

			postMessage({
				message: 'finished',
				filename: data.filename,
				arrayBuffer: data.arrayBuffer,
				size: data.size,
				fileextension: data.filename.split('.').pop()
			});
		});
	};

	const deleteDataFromDatabase = (data: DataMessage) => {
		sqlite3InitModule().then(async (sqlite3) => {
			//@ts-ignore
			const db = new sqlite3.opfs.OpfsDb(dbFileName, 'c');
			const res = db.exec(`DELETE FROM ${tableName} WHERE filename= '${data.filename}'`);

			if (res) {
				postMessage({ message: 'delete_success', filename: data.filename });
			} else {
				postMessage({ error: `Failed to delete ${data.filename}` });
			}

			db.close();
		});
	};

	const openDB = (sqlite3: Sqlite3) => {
		if (!globalDb) {
			//@ts-ignore
			globalDb = new sqlite3.opfs.OpfsDb(dbFileName, 'c');
			console.log('opened db');
		}
		return globalDb;
	};

	const insertDataIntoDatabase = (data: DataMessage) => {
		sqlite3InitModule().then(async () => {
			//@ts-ignore
			const stmt = globalDb.prepare(
				`INSERT OR IGNORE INTO ${tableName} (filename, id, data, size, filetype, shardIndex) 
             VALUES (?, ?, ?, ?, ?, ?)`
			);
			const success = stmt
				.bind([
					data.filename,
					data.id,
					data.arrayBuffer,
					data.size,
					data.fileextension,
					data.shardIndex
				])
				.stepFinalize();

			if (success) {
				postMessage({ status: 'done', message: 'success', filename: data.filename });
			} else {
				postMessage({ status: 'done', error: `Failed to insert ${data.filename}` });
			}
		});
	};

	const closeDB = () => {
		if (globalDb) {
			globalDb.close();
			globalDb = null;
		}
	};
</script>
