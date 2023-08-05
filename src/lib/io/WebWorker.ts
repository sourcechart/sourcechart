//@ts-ignore
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

//@ts-ignore
const logHtml = function (cssClass, ...args: Array<any>) {
	postMessage({
		type: 'log',
		payload: { cssClass, args }
	});
};

const log = (...args: Array<any>) => logHtml('', ...args);
const error = (...args: Array<any>) => logHtml('error', ...args);

const start = function (sqlite3: any) {
	let db;
	if (sqlite3.opfs) {
		db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
		log('The OPFS is available.');
	} else {
		db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
	}

	try {
		log('Create a table...');
		db.exec('CREATE TABLE IF NOT EXISTS t(a,b)');
		log('Insert some data using exec()...');
		let i;
		for (i = 20; i <= 25; ++i) {
			db.exec({
				sql: 'INSERT INTO t(a,b) VALUES (?,?)',
				bind: [i, i * 2]
			});
		}
		log("Query data with exec() using rowMode 'array'...");
		db.exec({
			sql: 'SELECT a FROM t ORDER BY a LIMIT 3',
			rowMode: 'array', //@ts-ignore
			callback: function (row) {
				//@ts-ignore
				log('row ', ++this.counter, '=', row);
			}.bind({ counter: 0 })
		});
		console.log(db);
	} finally {
		db.close();
	}
};

log('Loading and initializing sqlite3 module...');
sqlite3InitModule({
	print: log,
	printErr: error
}).then(function (sqlite3: object) {
	try {
		start(sqlite3);
	} catch (e: unknown) {
		//@ts-ignore
		error('Exception:', e.message);
	}
});
