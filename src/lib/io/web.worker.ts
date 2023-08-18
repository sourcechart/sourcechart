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

let rootDirectory;

navigator.storage.getDirectory().then((fetchedRootDirectory) => {
	rootDirectory = fetchedRootDirectory;
});

let tableName: string = 'localDB';
let dbPath = './LocalDB.sqlite3';

const upsertDestinationFolders = async (location) => {
	const folderNames = location.split('/');
	let acc = [];

	// Loop over all the parts of the path that aren't the filename
	for (const [index, folderName] of folderNames.slice(0, folderNames.length - 1).entries()) {
		// When we haven't created any of the path yet
		if (acc.length === 0) {
			// Create a directory under the root
			const folderHandle = await rootDirectory.getDirectoryHandle(folderName, {
				create: true
			});

			// Push as the first value of acc
			acc.push(folderHandle);
		} else {
			// Get the parent directory (i.e. the last directory created)
			const parentDirectory = acc[index - 1];

			// Create a directory under the parent
			const folderHandle = await parentDirectory.getDirectoryHandle(folderName, {
				create: true
			});

			acc.push(folderHandle);
		}
	}

	return acc;
};
onmessage = (e: MessageEvent) => {
	const messageData: DataMessage = e.data;

	switch (messageData.message) {
		case 'initialize':
			insertDataIntoDatabase(messageData);
			break;
		case 'query':
			getBinaryFromDatabase(messageData);
			break;
		case 'getDatasets':
			getUniqueDatasets(messageData);
			break;
		default:
			postMessage({ error: 'Invalid command' });
	}
};

const getUniqueDatasets = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb(dbPath);
		const res = db.exec(`SELECT filename FROM ${tableName}`, {
			returnValue: 'resultRows'
		});
		console.log(res);
	});
};

const getBinaryFromDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb(dbPath);
		const res = db.exec(`SELECT * FROM ${tableName} WHERE filename= '${data.filename}'`, {
			returnValue: 'resultRows'
		});

		var hexEncoding = res[0][1];
		postMessage({
			message: 'finished',
			filename: data.filename,
			hexadecimal: hexEncoding,
			size: data.size,
			fileextension: data.filename.split('.').pop()
		});
		db.close();
	});
};

const insertDataIntoDatabase = (data: DataMessage) => {
	sqlite3InitModule().then(async (sqlite3) => {
		console.log(data);
		//@ts-ignore
		const db = new sqlite3.opfs.OpfsDb(dbPath);
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
		db.close();
	});
};
