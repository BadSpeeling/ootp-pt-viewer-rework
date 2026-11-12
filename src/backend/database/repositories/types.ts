import { Position, Bats, Throws } from "../../types";
import { PtCardRosterStatus } from '../../../userInterfaceTypes'

export interface CreateStatsBatchCommand {
    TournamentTypeID: number,
    Description: string,
    TournamentStartDate: string,
}

export interface GetRecentTournamentResultsQuery {
    TeamName: string,
    Timeframe?: {
        StartDate: string,
        EndDate: string,
    },
    TournamentCount?: number,
    TournamentTypeID?: number,
}

export interface PtRosterResult {
    CardStatus: PtCardRosterStatus, 
    CardTitle: string, 
    PtCardID: number,
    CardValue: number, 
    Position: Position, 
    Bats: Bats, 
    Throws: Throws, 
    AvoidKs: number, 
    BABIP: number, 
    Gap: number, 
    Power: number, 
    Eye: number, 
    Stuff: number, 
    pHR: number, 
    pBABIP: number, 
    Control: number, 
    Stamina: number, 
    CatcherAbil: number, 
    CatcherArm: number, 
    CatcherFrame: number, 
    InfieldArm: number, 
    InfieldError: number, 
    InfieldRange: number,
    DP: number,
    Height: number, 
    OFRange: number, 
    OFArm: number, 
    OFError: number,
    LearnC: number,
    Learn1B: number,
    Learn2B: number,
    Learn3B: number,
    LearnSS: number,
    LearnLF: number,
    LearnCF: number,
    LearnRF: number,
}