import * as sqlite3 from 'sqlite3'
import * as sqlite from 'sqlite'

import * as path from 'node:path'

import { DatabaseRecord } from '../types'


export class Database {

    db: sqlite.Database<sqlite3.Database, sqlite3.Statement> | null;
    databasePath: string[];

    constructor (databasePath: string[]) {
        this.databasePath = databasePath;
        this.db = null;
    }

    async openConnection () {
        this.db = await sqlite.open({
            filename: path.join(...this.databasePath),
            driver: sqlite3.Database
        });
    }

    async closeConnection () {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        await this.db.close();

    }

    private sanitize (sql: string) {
        return sql.replaceAll('--','');
    }

    async execute (sql: string) {
    
        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        await this.db.exec(this.sanitize(sql));
        
    }

    async insertOne (sql: string): Promise<number> {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        const result = await this.db.run(this.sanitize(sql));

        if (typeof result.lastID !== 'number') {
            throw Error("Did not insert");
        }

        return result.lastID;

    }

    async get (sql: string): Promise<DatabaseRecord> {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        const result = await this.db.get(this.sanitize(sql));
        return result;

    }

    async getMapped <T> (sql: string): Promise<T> {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        const result = await this.db.get(this.sanitize(sql))
        return result as T;

    }

    async getAll (sql: string): Promise<DatabaseRecord[]> {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        const result = await this.db.all(this.sanitize(sql))
        return result;

    }

    async getAllMapped <T> (sql: string): Promise<T[]> {

        if (!this.db) {
            throw Error("Open the connection to the database!");
        }

        const result = await this.db.all(this.sanitize(sql))
        return result.map((row) => row as T)

    }

}