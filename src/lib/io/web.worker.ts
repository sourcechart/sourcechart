import sqlite3InitModule from 'sqlite-wasm-esm';

let opfsDb;

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
		let options: any = {
			sql: `SELECT 'Hello, world!'`,
			returnValue: 'resultRows'
		};
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('my-db', 'c');
		let results = db.exec((options = options));
		console.log(results);
	});
};
