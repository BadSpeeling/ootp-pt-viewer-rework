export interface CreateStatsBatchCommand {
    TournamentTypeID: number,
    Description: string,
    TournamentStartDate: string,
}

export interface GetRecentTournamentResultsQuery {
    TeamName?: string,
    Timeframe?: {
        StartDate: string,
        EndDate: string,
    },
    TournamentCount?: number,
    TournamentTypeID?: number,
}