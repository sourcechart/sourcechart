import sqlite3InitModule from 'sqlite-wasm-esm';
import { hexToBuffer } from '$lib/io/HexOps';

type MessageData = {
	message: string;
	size: number;
	id: string;
	filename: string;
	hexadecimal: string;
};

onmessage = (e: MessageEvent) => {
	const messageData: MessageData = e.data;
	console.log(e.data);

	switch (messageData.message) {
		case 'initialize':
			InsertDataIntoDatabase(messageData);
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const InsertDataIntoDatabase = (data: MessageData) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		var tableName: string = 'local';
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS ${tableName} (filename TEXT, data TEXT, size INTEGER, id VARCHAR(10)); 
			INSERT INTO ${tableName} (filename, data, size, id) VALUES ('${data.filename}', '${data.hexadecimal}', ${data.size}, '${data.id}');
			`
		);

		var results = db.exec(`SELECT * FROM ${tableName};`, { returnValue: 'resultRows' });
		db.close();
		postMessage({ message: 'finished' });
	});
};
