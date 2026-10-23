import { Bats, Position } from "./backend/types";

export enum CurrentPage {
    LANDING,CARD_IMPORTER,STATS_IMPORTER,TOURNAMENT_STATS
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