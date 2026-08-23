import { Database } from "./database/Database"
import { getLiveUpdatesScript } from './database/sqliteScripts'

import { LiveUpdate } from "./database/DatabaseTypes"

export const getLiveUpdates = async (databasePath: string[]) => {
    const db = new Database(databasePath);
    return await db.getAllMapped<LiveUpdate>(getLiveUpdatesScript());
}
