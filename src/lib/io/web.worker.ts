import sqlite3InitModule from 'sqlite-wasm-esm';

type DataMessage = {
	message: string;
	filename: string;
	file?: FileUpload;
	size?: number;
	id?: string;
	hexadecimal?: string;
	fileextension?: string;
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

		var hexEncoding = res[0][1];
		postMessage({
			message: 'finished',
			filename: data.filename,
			hexadecimal: hexEncoding,
			size: data.size,
			id: data.datasetID,
			fileextension: data.filename.split('.').pop()
		});
	});
};

const insertDataIntoDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb('LocalDB', 'c');
		db.exec(
			`
			CREATE TABLE IF NOT EXISTS ${tableName} (
				filename TEXT,
				data TEXT,
				size INTEGER,
				filetype VARCHAR(10),
				UNIQUE(filename, data, size, filetype)
			);

			INSERT OR IGNORE INTO ${tableName} (filename, data, size, filetype) VALUES ('${data.filename}', '${data.hexadecimal}', ${data.size}, '${data.fileextension}');
			`
		);

		var res = db.exec(`SELECT * FROM ${tableName} WHERE filename= '${data.filename}'`, {
			returnValue: 'resultRows'
		});
		console.log(res);
		db.close();
		postMessage({ message: 'finished' });
	});
};
