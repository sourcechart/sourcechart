import sqlite3InitModule from 'sqlite-wasm-esm';

let db;

onmessage = (e) => {
	const { message } = e.data;

	switch (message) {
		case 'initialize':
			initDB();
			//executeQuery();
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const initDB = () => {
	sqlite3InitModule().then((sqlite3) => {
		//@ts-ignore
		db = new sqlite3.opfs.OpfsDb('my-db', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS test_table (test TEXT); 
			INSERT INTO test_table (test) VALUES ('Hello, world!');
			`
		);
		let results = db.exec(`SELECT * FROM test_table;`, { returnValue: 'resultRows' });
		console.log('results: ', results, 'db: ', db);
		db.close();
		postMessage({ message: 'finished' });
	});
};

const executeQuery = () => {};
