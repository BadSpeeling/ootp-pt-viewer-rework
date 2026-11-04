import { StatsBatch } from "../../types";
import { Database } from "../Database";
import { Repository } from "./Repository";
import { CreateStatsBatchCommand } from "./types";

export class StatsBatchRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    public async createStatsBatch (command: CreateStatsBatchCommand) : Promise<StatsBatch> {

        const createStatsBatchScript = this.getCreateStatsBatchScript(command);
        await this.database.openConnection();
        const statsBatchID = await this.database.insertOne(createStatsBatchScript);
        await this.database.closeConnection();

        const getStatsBatchScript = this.getGetStatsBatchScript(statsBatchID);
        await this.database.openConnection();
        const statsBatch = await this.database.getMapped<StatsBatch>(getStatsBatchScript);
        await this.database.closeConnection();

        return statsBatch;            

    }

    private getCreateStatsBatchScript (command: CreateStatsBatchCommand) {
        return `
INSERT INTO StatsBatch (TournamentTypeID,Description,TournamentStartDate,Timestamp) VALUES (${command.TournamentTypeID},'${command.Description}','${command.TournamentStartDate}',datetime(unixepoch(), 'unixepoch'));    
`
    }

    private getGetStatsBatchScript (statsBatchID: number) {
        return `
SELECT StatsBatchID,TournamentTypeID,Description,TournamentStartDate,Timestamp FROM StatsBatch WHERE StatsBatchID = ${statsBatchID}
`
    }

}