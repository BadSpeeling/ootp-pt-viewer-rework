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

export enum StatsType {
    BATTING,PITCHING,FIELDING,
}

export enum PtDataExportState {
    READY_TO_READ,NO_OUTPUT_FILES,MULTIPLE_OUTPUT_FILES,ERROR
}

export enum PtCardRosterStatus {
    ACTIVE_ROSTER,RESERVE_ROSTER,OFF_ROSTER,
}

export enum ImportCardResult {
    SUCCESS,FAIL,LIVE_UPDATE_NEEDED
}