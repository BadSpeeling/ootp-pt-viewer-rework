export interface CsvRecord {
    [index:string]: string|number,
}

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

export enum Bats {
    R = 1,
    L = 2,
    S = 3,
}

export enum Throws {
    R = 1,
    L = 2,
}

export enum Position {
    P = 1,
    C = 2,
    '1B' = 3,
    '2B' = 4,
    '3B' = 5,
    SS = 6,
    LF = 7,
    CF = 8,
    RF = 9,
    DH = 10,
}

export interface PtDataExportFile {
    exportState:PtDataExportState,
    ptFolderPath:string[],
    filePath:string[],
    fileName?:string,
    ptDataFolderPath:string[],
}

export enum PtDataExportState {
    READY_TO_READ,NO_OUTPUT_FILES,MULTIPLE_OUTPUT_FILES,ERROR
}

export interface ImportStatFileRequest {
    statsFilePath: string[],
    description: string,
    tournamentTypeID: number,
    tournamentStartDate: string,
    onlyMyTeam: boolean,
}

export enum StatsType {
    BATTING,PITCHING,FIELDING,
}