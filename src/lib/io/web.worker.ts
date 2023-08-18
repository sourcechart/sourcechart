import sqlite3InitModule from 'sqlite-wasm-esm';

type DataMessage = {
	message: string;
	filename: string;
	file?: FileUpload;
	size?: number;
	id?: string;
	hexadecimal?: string;
	fileextension?: string;
};
console.log();
let tableName = 'datastash';
let dbFileName = 'LocalDB';

onmessage = async (e: MessageEvent) => {
	const opfsRoot = await navigator.storage.getDirectory();
	const fileHandle = await opfsRoot.getFileHandle(dbFileName, { create: true });
	const accessHandle = fileHandle.createSyncAccessHandle();
	//	const accessHandle = await fileHandle.getFileHandle(dbFileName);

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
			postMessage({ error: 'Invalid command' });
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
		console.log(data);
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
