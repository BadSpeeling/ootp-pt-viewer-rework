export enum CurrentPage {
    LANDING,CARD_IMPORTER,STATS_IMPORTER
}

export enum ImportCardResult {
    SUCCESS,FAIL,LIVE_UPDATE_NEEDED
}

export interface LiveUpdate {
    LiveUpdateID: number,
    EffectiveDate: string,
}

export interface PtDataFolder {
    ptFolderPath: string,
}

export interface PtDataFile extends PtDataFolder {
    fileName: string,
    filePath: string,
    description: string,
    tournamentStartDate: string,
    isIncludedFlag: boolean,
    onlyMyTeamFlag: boolean,
    dataSaveStatus: TournamentFolderImportStatus,
}

export enum TournamentFolderImportStatus {
    None, Pending, Successful, Failure,
}