import sqlite3InitModule from 'sqlite-wasm-esm';

const getExampleBlob = () => {
	const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
	return blob;
};

onmessage = (e) => {
	const { message } = e.data;

	switch (message) {
		case 'initialize':
			initDB();
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const initDB = () => {
	sqlite3InitModule().then((sqlite3) => {
		let blob = getExampleBlob();
		let filename = 'test.txt';

		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS foo (filename TEXT, binary BLOB); 
			`
		);
		db.exec(``);

		/*
		db.exec(`INSERT INTO foo (filename, binary) VALUES (${filename}, ${blob});`);
		*/

		let results = db.exec(`SELECT * FROM foo;`, { returnValue: 'resultRows' });
		console.log('results: ', results, 'db: ', db);
		db.close();
		postMessage({ message: 'finished' });
	});
};

const executeQuery = () => {};
