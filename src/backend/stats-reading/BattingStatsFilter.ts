import { Position } from "../enums";

export interface BattingStatsFilter {
    TournamentTypeID: number,
    Positions: 'ANY'| Position[],
    TournamentTimeRange?: {
        StartDate: string,
        EndDate: string,
    }
    TeamName?: string, 
}