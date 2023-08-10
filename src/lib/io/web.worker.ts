import sqlite3InitModule from 'sqlite-wasm-esm';

let opfsDb: any;

onmessage = (e) => {
	const { command } = e.data;
	switch (command) {
		case 'initialize':
			initDB();
			break;
		case 'query':
			executeQuery();
			break;
		default:
			self.postMessage({ error: 'Invalid command' });
	}
};

const initDB = () => {
	sqlite3InitModule().then((sqlite3) => {
		//@ts-ignore
		opfsDb = new sqlite3.opfs.OpfsDb('my-db', 'c');
		opfsDb.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');

		//.then(() => {
		//		self.postMessage({ success: true, message: 'Database initialized.' });
		//	})
		//	.catch((error) => {
		//		self.postMessage({ success: false, error: error.message });
		//	});
	});
};

const executeQuery = () => {
	if (!opfsDb) {
		self.postMessage({ success: false, error: 'Database is not initialized.' });
		return;
	}

	opfsDb
		.exec('INSERT INTO test (name) VALUES (?)', ['test'])
		.then(() => {
			opfsDb
				.exec('SELECT * FROM test') //@ts-ignore
				.then((result) => {
					self.postMessage({ success: true, result });
				}) //@ts-ignore
				.catch((error) => {
					self.postMessage({ success: false, error: error.message });
				});
		}) //@ts-ignore
		.catch((error) => {
			self.postMessage({ success: false, error: error.message });
		});
};
