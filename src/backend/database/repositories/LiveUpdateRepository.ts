import { LiveUpdate } from "../DatabaseTypes";
import { Database } from "../Database";
import { Repository } from "./Repository";

export class LiveUpdateRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    public async createLiveUpdate (effectiveDate: string) : Promise<LiveUpdate> {

        const liveUpdateInsertScript = this.getCreateLiveUpdateScript(effectiveDate);
        await this.database.openConnection();
        const liveUpdateID = await this.database.insertOne(liveUpdateInsertScript);
        await this.database.closeConnection();

        return {
            LiveUpdateID: liveUpdateID,
            EffectiveDate: effectiveDate,
        };            

    }

    public async getLiveUpdates () : Promise<LiveUpdate[]> {

        const getLiveUpdateScript = this.getLiveUpdatesScript();
        await this.database.openConnection();
        const liveUpdates = await this.database.getAllMapped<LiveUpdate>(getLiveUpdateScript);
        await this.database.closeConnection();

        return liveUpdates;

    }

    private getCreateLiveUpdateScript (effectiveDate: string) {
        return `
INSERT INTO LiveUpdate (EffectiveDate) VALUES ('${effectiveDate}');    
`
    }

    private getLiveUpdatesScript () {
        return `
SELECT LiveUpdateID,EffectiveDate FROM LiveUpdate;
        `
    }

}