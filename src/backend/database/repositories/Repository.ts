import { Database } from "../Database";

export class Repository {

    database: Database;

    constructor (database: Database) {
        this.database = database;
    }

}