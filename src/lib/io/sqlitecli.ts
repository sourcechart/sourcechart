export class SqliteWasm {
	dbName: string;
    _db:null|undefined;
    
	constructor(dbName: string) {
		this.dbName = dbName;
	}

	public insertBlob(blob: Blob) {

  }

  public db(){
    if (!this._db){
        this._db = makeSqliteDB()
    }
  }

}


const makeSqliteDB = (sqlite3: object, database: string, sql: string) => {
	let db;
	const fileName = `/${database}.db`;
	if (sqlite3.opfs) {
		db = new sqlite3.oo1.OpfsDb(fileName);
	} else {
		db = new sqlite3.oo1.DB(fileName, 'ct');
	}
	try {
		sql.split(';').forEach((sqlStatement) => {
			sqlStatement += ';';
			db.exec(sqlStatement);
		});
	} catch (err: any) {
		db.close();
		console.error(err.name, err.message);
		return;
	}
    return db
};