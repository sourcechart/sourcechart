import sqlite3InitModule from 'sqlite-wasm-esm';

let opfsDb;

onmessage = function (e) {
	const { command } = e.data;

	console.log('command', command);
	switch (command) {
		case 'initialize':
			initializeDb();
			break;
		case 'query':
			executeQuery();
			break;
		default:
			self.postMessage({ error: 'Invalid command' });
	}
};

function initializeDb() {
	sqlite3InitModule().then((sqlite3) => {
		//@ts-ignore
		opfsDb = new sqlite3.opfs.OpfsDb('my-db', 'c');
		opfsDb.open().then(() => {
			opfsDb
				.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)')
				.then(() => {
					self.postMessage({ success: true, message: 'Database initialized.' });
				})
				.catch((error) => {
					self.postMessage({ success: false, error: error.message });
				});
		});
	});
}

function executeQuery() {
	if (!opfsDb) {
		self.postMessage({ success: false, error: 'Database is not initialized.' });
		return;
	}

	opfsDb
		.exec('INSERT INTO test (name) VALUES (?)', ['test'])
		.then(() => {
			opfsDb
				.exec('SELECT * FROM test')
				.then((result) => {
					self.postMessage({ success: true, result });
				})
				.catch((error) => {
					self.postMessage({ success: false, error: error.message });
				});
		})
		.catch((error) => {
			self.postMessage({ success: false, error: error.message });
		});
}
