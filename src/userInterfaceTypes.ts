import { Position, Bats, Throws } from './backend/types'

export enum CurrentPage {
    LANDING,CARD_IMPORTER,STATS_IMPORTER,TOURNAMENT_STATS,PT_ROSTER
}

export enum ImportCardResult {
    SUCCESS,FAIL,LIVE_UPDATE_NEEDED
}

export interface LiveUpdate {
    LiveUpdateID: number,
    EffectiveDate: string,
}

export interface PtDataFolder {
    ptFolderPath: string[],
    ptDataFolderPath: string[],
}

export interface PtDataFile extends PtDataFolder {
    fileName: string,
    filePath: string[],
    description: string,
    tournamentStartDate: string,
    isIncludedFlag: boolean,
    onlyMyTeamFlag: boolean,
    dataSaveStatus: TournamentFolderImportStatus,
}

export enum TournamentFolderImportStatus {
    None, Pending, Successful, Failure,
}

export interface TournamentType {
    TournamentTypeID: number,
    TournamentName: string,
}

export interface TournamentBattingStats {
    CardTitle: string,
    CardValue: number,
    Position: string,
    Bats: string,
    PA: number,
    AVG: number,
    OBP: number,
    SLG: number,
    OPS: number,
}

export interface TournamentPitchingStats {
    CardTitle: string,
    CardValue: number,
    Throws: string,
    G: number,
    GS: number,
    'K/9': number,
    'BB/9': number,
    'HR/9': number,
    'H/9': number,
    ERA: number,
}

export interface TournamentResult {
    W: number,
    L: number,
    StatsBatchID: number,
    TeamName: string,
    TournamentTypeID: number,
    TournamentName: string,
    TournamentStartDate: string,
}

export interface PtCardRatings {
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
    OFRange: number, 
    OFArm: number, 
    OFError: number,
    TotalBattingRating: number,
    TotalPitchingRating: number,
    OnBaseRating: number,
    SluggingRating: number,
    ThreeTrueRating: number,
    RatingC: number,
    Rating1B: number,
    Rating2B: number,
    Rating3B: number,
    RatingSS: number,
    RatingLF: number,
    RatingCF: number,
    RatingRF: number,
}

export enum PtCardRosterStatus {
    ACTIVE_ROSTER,RESERVE_ROSTER,OFF_ROSTER,
}