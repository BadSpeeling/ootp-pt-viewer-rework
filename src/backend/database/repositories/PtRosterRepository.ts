import { Database } from "../Database";
import { PtRosterResult } from "./types";
import { Repository } from "./Repository";
import { OotpDataExport } from '../../export-stats'

export class PtRosterRepository extends Repository {

    ptRoster: OotpDataExport;

    constructor (database: Database, ptRoster: OotpDataExport) {
        super(database);
        this.ptRoster = ptRoster;
    }

    async loadPtRoster () {
        
        const loadPtCurrentRosterScript = this.ptRoster.generateLoadExportedDataScript(undefined, "PtRoster");

        await this.database.openConnection();
        await this.database.execute(loadPtCurrentRosterScript);
        await this.database.execute(this.loadPtCardsScript());
        const ptRoster = await this.database.getAllMapped<PtRosterResult>(this.getPtCardRatings());
        await this.database.closeConnection();

        return ptRoster;

    }

    private loadPtCardsScript () {
        return `
create table temp.LatestLiveUpdate (
	LiveUpdateID INTEGER
);

insert into temp.latestLiveUpdate
select LiveUpdateID
from LiveUpdate
order by LiveUpdateID DESC
limit 1;
        `
    }

    private getPtCardRatings () {
        return `
select 
    case 
        when t.CardStatus = 'Active Roster' then 0 
        when t.CardStatus = 'Reserve Roster' then 1 
        else 2 
    end CardStatus, 
    CardTitle, 
    pt.PtCardID, 
    CardValue, 
    Position, 
    Bats, 
    Throws, 
    AvoidKs, 
    BABIP, 
    Gap, 
    Power, 
    Eye, 
    Stuff, 
    pHR, 
    pBABIP, 
    Control, 
    Stamina, 
    CatcherAbil, 
    CatcherArm, 
    CatcherFrame, 
    InfieldArm, 
    InfieldError, 
    InfieldRange,
    DP,
    Height, 
    OFRange, 
    OFArm, 
    OFError,
    LearnC,
    Learn1B,
    Learn2B,
    Learn3B,
    LearnSS,
    LearnLF,
    LearnCF,
    LearnRF
from PtCard pt
join temp.latestLiveUpdate lu on pt.CardType != 1 or lu.LiveUpdateID = pt.LiveUpdateID
left join temp.PtRoster t on pt.CardID = t.CardID        
        `
    } 

}