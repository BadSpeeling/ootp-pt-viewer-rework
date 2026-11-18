import { Database } from "../Database";
import { Repository } from "./Repository";
import { GetLastestTournamentResultsQuery } from "./types";
import { TournamentResult } from '../../../userInterfaceTypes';

export class TournamentRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    public async getLatestTournamentResultsAsync (query: GetLastestTournamentResultsQuery) {

        const script = this.getLatestTournamentResultsScript(query);
		await this.database.openConnection();
        const tournamentResults = await this.database.getAllMapped<TournamentResult>(script);
		await this.database.closeConnection();
        return tournamentResults;

    }

    public async deleteTournamentAsync (statsBatchID: number) {

        const script = `
BEGIN TRANSACTION;
DELETE FROM BattingStats WHERE StatsBatchID = ${statsBatchID};
DELETE FROM PitchingStats WHERE StatsBatchID = ${statsBatchID};
DELETE FROM StatsBatch WHERE StatsBatchID = ${statsBatchID};
		`

		try {
        	await this.database.openConnection();
        	await this.database.execute(script);
			await this.database.execute('COMMIT;');        	
		}
		catch (err) {
			await this.database.execute('ROLLBACK;');
			throw Error (`Failed deleting tournament stats for StatsBatch ${statsBatchID}: ${(err as Error).message}`);
		}
		finally {
			await this.database.closeConnection();
		}

    }

    private getLatestTournamentResultsScript (query: GetLastestTournamentResultsQuery) {

        return `
SELECT r.*, tt.Name TournamentName, sb.TournamentStartDate
FROM (
	SELECT SUM(W) W, SUM(L) L, sb.StatsBatchID, ps.TeamName, sb.TournamentTypeID
	FROM (
		SELECT StatsBatchID, TournamentTypeID
		FROM StatsBatch
		WHERE 1=1
		${query.TournamentTypeID ? `AND TournamentTypeID = ${query.TournamentTypeID}` : ""}		
		ORDER BY UNIXEPOCH(TournamentStartDate) DESC, TournamentTypeID
		${query.TournamentCount ? "LIMIT " + query.TournamentCount : ""}
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