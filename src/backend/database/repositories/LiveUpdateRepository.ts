import { LiveUpdate } from "../../types";
import { Database } from "../Database";

export class LiveUpdateRepository {

    database: Database;

    constructor (database: Database) {
        this.database = database;
    }

    public async createLiveUpdate (effectiveDate: string) : Promise<LiveUpdate> {

        const liveUpdateInsertScript = this.getCreateLiveUpdateScript(effectiveDate);
        const liveUpdateID = await this.database.insertOne(liveUpdateInsertScript);

        return {
            LiveUpdateID: liveUpdateID,
            EffectiveDate: effectiveDate,
        };            

    }

    private getCreateLiveUpdateScript (effectiveDate: string) {
        return `
INSERT INTO LiveUpdate (EffectiveDate) VALUES ('${effectiveDate}');    
`
    }

}