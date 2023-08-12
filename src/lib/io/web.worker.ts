import sqlite3InitModule from 'sqlite-wasm-esm';

type DataMessage = {
	message: string;
	filename: string;
	file?: FileUpload;
	size?: number;
	id?: string;
	hexadecimal?: string;
};

let tableName: string = 'local';

onmessage = (e: MessageEvent) => {
	const messageData: DataMessage = e.data;

	switch (messageData.message) {
		case 'initialize':
			insertDataIntoDatabase(messageData);
			break;
		case 'query':
			if (messageData?.file) getBinaryFromDatabase(messageData.file);
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const getBinaryFromDatabase = (data: FileUpload) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		const res = db.exec(`SELECT * FROM ${tableName} WHERE filename= '${data.filename}'`, {
			returnValue: 'resultRows'
		});

		var hex = res[0][1];
		db.close();
	});
};

const insertDataIntoDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS ${tableName} (filename TEXT, data TEXT, size INTEGER, id VARCHAR(10)); 
			INSERT INTO ${tableName} (filename, data, size, id) VALUES ('${data.filename}', '${data.hexadecimal}', ${data.size}, '${data.id}');
			`
		);
		db.close();
		postMessage({ message: 'finished' });
	});
};
