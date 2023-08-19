//@ts-ignore
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

type DataMessage = {
	message: string;
	filename: string;
	file?: FileUpload;
	size?: number;
	id?: string;
	hexadecimal?: string;
	fileextension?: string;
};
let tableName = 'datastash';
let dbFileName = 'LocalDB';

onmessage = async (e: MessageEvent) => {
	const opfsRoot = await navigator.storage.getDirectory();
	const fileHandle = await opfsRoot.getFileHandle(dbFileName, { create: true }); //@ts-ignore
	const accessHandle = fileHandle.createSyncAccessHandle();

	const messageData: DataMessage = e.data;

	switch (messageData.message) {
		case 'initialize':
			insertDataIntoDatabase(messageData);
			break;
		case 'query':
			getBinaryFromDatabase(messageData);
			break;
		case 'getDatasets':
			getUniqueDatasets(messageData);
			break;
		default:
			foo();
	}
};

const getUniqueDatasets = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//git
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		const res = db.exec(`SELECT filename FROM ${tableName}`, {
			returnValue: 'resultRows'
		});
		console.log(res);
	});
};

const getBinaryFromDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		const res = db.exec(`SELECT * FROM ${tableName} WHERE filename= '${data.filename}'`, {
			returnValue: 'resultRows'
		});

		var hexEncoding = res[0][1];
		postMessage({
			message: 'finished',
			filename: data.filename,
			hexadecimal: hexEncoding,
			size: data.size,
			fileextension: data.filename.split('.').pop()
		});
		db.close();
	});
};

const insertDataIntoDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS ${tableName} (
				filename TEXT,
				data TEXT,
				size INTEGER,
				filetype VARCHAR(10),
				UNIQUE(filename, data, size, filetype)
			);

			INSERT OR IGNORE INTO ${tableName} (filename, data, size, filetype) VALUES ('${data.filename}', '${data.hexadecimal}', ${data.size}, '${data.fileextension}');
			`
		);
		db.close();
	});
};

const foo = () => {
	// In `worker.js`.

	const log = (...args) => console.log(...args);
	const error = (...args) => console.error(...args);

	const start = function (sqlite3) {
		log('Running SQLite3 version', sqlite3.version.libVersion);
		let db;
		if ('opfs' in sqlite3) {
			db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
			log('OPFS is available, created persisted database at', db.filename);
		} else {
			db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
			log('OPFS is not available, created transient database', db.filename);
		}
		// Your SQLite code here.
	};

	log('Loading and initializing SQLite3 module...');
	sqlite3InitModule({
		print: log,
		printErr: error
	}).then((sqlite3) => {
		log('Done initializing. Running demo...');
		try {
			start(sqlite3);
		} catch (err) {
			error(err.name, err.message);
		}
	});
};
