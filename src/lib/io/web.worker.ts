import sqlite3InitModule from 'sqlite-wasm-esm';

let opfsDb: any;

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
		opfsDb = new sqlite3.opfs.OpfsDb('my-db', 'c');
		try {
			opfsDb.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');
			postMessage({ success: true, message: 'Database initialized.' });
			opfsDb.exec('INSERT INTO test (name) VALUES (?)', ['test']);
			let res = opfsDb.exec('SELECT * FROM test'); //@ts-ignore
			console.log(res);
		} catch (error) {
			postMessage({ success: false, message: error });
		}
	});
};
