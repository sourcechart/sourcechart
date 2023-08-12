import sqlite3InitModule from 'sqlite-wasm-esm';

onmessage = (e) => {
	const { message } = e.data;
	console.log(e.data);

	switch (message) {
		case 'initialize':
			initDB();
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const initDB = () => {
	sqlite3InitModule().then(async (sqlite3) => {
		let fileExtension = 'txt';
		let partition_number = 0;
		let filename = 'test.txt';
		let table_name = 'dsadsa';
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS ${table_name} (filename TEXT, blob BLOB); 
			INSERT INTO ${table_name} (filename, blob) VALUES ('${filename}', '${b}}');
			`
		);

		let results = db.exec(`SELECT * FROM ${table_name};`, { returnValue: 'resultRows' });
		db.close();
		postMessage({ message: 'finished' });
	});
};
