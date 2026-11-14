import { PtDataExportState } from './enums'

export interface DatabaseRecord {
    [index:string]: string|number,
}

export interface OotpExportDataColumn {
    nameInSource: string,
    databaseColumnName: string,
    type: OotpExportDataColumnType,
}

export type OotpExportDataColumnType = "INTEGER"|"REAL"|"TEXT"|"DATETIME"

export interface DataTableColumn {
    name: string,
    type: OotpExportDataColumnType,
    notNull: boolean,
}

export interface Constraint {
    type: "UNIQUE"
    fields: string[],
}

export interface DatatableModel {
    tableName: string,
    columns: DataTableColumn[],
    primaryKey?: PrimaryKey,
    constraints?: Constraint[],
    foreignKeyTables?: string[],
    indicies?: Index[],
}

export interface Index {
    columns: string[],
}

export interface PrimaryKey {
    column: string,
    autoincrement: boolean,
}

export interface TournamentBattingStatsSum {
    PtCardID: number,
    CardTitle: string,
    CardValue: number,
    Position: string,
    Bats: string,
    H: number,
    AB: number,
    BB: number,
    IBB: number,
    HP: number,
    SF: number,
    PA: number,
    TB: number,
}

export interface TournamentPitchingStatsSum {
    PtCardID: number,
    CardTitle: string,
    CardValue: number,
    Throws: string,
    G: number,
    GS: number,
    K: number,
    BB: number,
    HR: number,
    HA: number,
    ER: number,
    Outs: number,
}

export interface PtDataExportFile {
    exportState:PtDataExportState,
    ptFolderPath:string[],
    filePath:string[],
    fileName?:string,
    ptDataFolderPath:string[],
}

export interface ImportStatFileRequest {
    statsFilePath: string[],
    description: string,
    tournamentTypeID: number,
    tournamentStartDate: string,
    onlyMyTeam: boolean,
}