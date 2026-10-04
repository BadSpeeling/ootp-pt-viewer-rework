import { LiveUpdate } from "../../types";
import { Database } from "../Database";
import { Repository } from "./Repository";

export class LiveUpdateRepository extends Repository {

    constructor (database: Database) {
        super(database);
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