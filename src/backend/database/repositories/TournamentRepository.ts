import { Database } from "../Database";
import { Repository } from "./Repository";
import { GetRecentTournamentResultsQuery } from "./types";
import { TournamentResult } from '../../../userInterfaceTypes';

export class TournamentRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    public async getRecentTournamentResultsAsync (query: GetRecentTournamentResultsQuery) {

        const script = this.getRecentTournamentResultsScript(query);
        const tournamentResults = await this.database.getAllMapped<TournamentResult>(script);
        return tournamentResults;

    }

    private getRecentTournamentResultsScript (query: GetRecentTournamentResultsQuery) {

        return `
SELECT r.*, tt.Name TournamentName, sb.TournamentStartDate
FROM (
	SELECT SUM(W) W, SUM(L) L, sb.StatsBatchID, ps.TeamName, sb.TournamentTypeID
	FROM (
		SELECT StatsBatchID, TournamentTypeID
		FROM StatsBatch
		WHERE 1=1
		AND unixepoch(TournamentStartDate) >= unixepoch('${query.Timeframe?.StartDate}')
		LIMIT ${query.TournamentCount}
	) sb
	JOIN PitchingStats ps on sb.StatsBatchID = ps.StatsBatchID
	JOIN TournamentType tt on sb.TournamentTypeID = tt.TournamentTypeID
	WHERE 1=1
	AND TeamName = '${query.TeamName}'
	GROUP BY sb.StatsBatchID, ps.TeamName, sb.TournamentTypeID
) r
JOIN TournamentType tt on r.TournamentTypeID = tt.TournamentTypeID
JOIN StatsBatch sb on r.StatsBatchID = sb.StatsBatchID
ORDER BY UNIXEPOCH(TournamentStartDate) DESC, TournamentTypeID        
`
    }

}