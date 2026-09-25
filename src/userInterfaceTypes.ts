import { PtDataExportState } from './backend/types'

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

export interface PtDataStatsFile {
    fileName: string,
    filePath: string,
    description: string,
    isIncludedFlag: boolean,
    dataSaveStatus: DataSaveStatus,
    onlyMyTeamFlag: boolean,
    dataExportState: PtDataExportState,
}

export enum DataSaveStatus {
    None, Pending, Successful, Failure,
}