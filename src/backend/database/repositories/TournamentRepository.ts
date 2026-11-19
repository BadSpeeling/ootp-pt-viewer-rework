import { Database } from "../Database";
import { Repository } from "./Repository";
import { GetLastestTournamentResultsQuery } from "./types";
import { TournamentRecord, TournamentBattingStats, TournamentPitchingStats, TournamentResult } from '../../../userInterfaceTypes';
import { TournamentBattingStatsSum, TournamentPitchingStatsSum } from '../../types'

export class TournamentRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    public async getLatestTournamentResultsAsync (query: GetLastestTournamentResultsQuery) {

        const script = this.getLatestTournamentResultsScript(query);
		await this.database.openConnection();
        const tournamentResults = await this.database.getAllMapped<TournamentRecord>(script);
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

	public async getTournamentResultAsync (statsBatchID: number): Promise<TournamentResult>  {

		try {
			await this.database.openConnection();
			await this.database.execute(this.loadRawPitchingTournamentResultScript(statsBatchID));
			const tournamentRecord = await this.database.getMapped<TournamentRecord>(this.getTournamentWinResult());
			const tournamentPitchingTotals = await this.database.getAllMapped<TournamentPitchingStatsSum>(this.getTournamentPitchingTotals());
			const tournamentBattingTotals = await this.database.getAllMapped<TournamentBattingStatsSum>(this.getTournamentBattingTotals(statsBatchID));

			const tournamentBattingResult = this.addBattingRateStats(tournamentBattingTotals);
			const tournamentPitchingResult = this.addPitchingRateStats(tournamentPitchingTotals);


			return {
				TournamentRecord: tournamentRecord,
				TournamentBattingStats: tournamentBattingResult,
				TournamentPitchingStats: tournamentPitchingResult,
			}
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

	private loadRawPitchingTournamentResultScript (statsBatchID: number) {
		return `
create table temp.TournamentPitchingStats as
select StatsBatchID,PtCardID,TeamName,W,L,G,GS,K,BB,HR,HA,ER,round([IP],0) * 3 + (case when instr(cast([IP] as text),'.') = 0 then 0 else substr(cast([IP] as text), instr(cast([IP] as text),'.')+1) end) Outs
from PitchingStats
where StatsBatchID = ${statsBatchID}
		`
	}

	private getTournamentWinResult () {
		return `
select r.*, tt.Name TournamentName
from (
	select SUM(W) W, SUM(L) L, StatsBatchID
	from temp.TournamentPitchingStats
	where TeamName = 'Lil Dicky'
	group by StatsBatchID
) r
join StatsBatch sb on sb.StatsBatchID = r.StatsBatchID
join TournamentType tt on sb.TournamentTypeID = tt.TournamentTypeID
		`
	}

	private getTournamentPitchingTotals () {
		return `
select c.CardTitle, c.PtCardID, c.CardValue, c.Position, c.Throws, SummedStats.*
from (
	select PtCardID, SUM(G) G, SUM(GS) GS, SUM(K) K, SUM(BB) BB, SUM(HR) HR, SUM(HA) HA, SUM(ER) ER, SUM(Outs) Outs
    from temp.TournamentPitchingStats
	group by PtCardID
) SummedStats
join PtCard c on SummedStats.PtCardID = c.PtCardID
ORDER BY SummedStats.Outs DESC
		`
	}

	private getTournamentBattingTotals (statsBatchID: number) {
		return `
select c.PtCardID, c.CardTitle, c.CardValue, c.Position, c.Bats, SummedStats.*
from (
	select PtCardID, SUM([G]) [G], SUM([GS]) [GS], SUM([PA]) [PA], SUM([AB]) [AB], SUM([H]) [H], SUM([HR]) [HR], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([HP]) [HP], SUM([SH]) [SH], SUM([SF]) [SF], SUM([SO]) [SO], SUM([TB]) [TB], ROUND(SUM([WAR]),1) [WAR], SUM([SB]) [SB], SUM([CS]) [CS]
	from BattingStats bs
	join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID
	where sb.StatsBatchID = ${statsBatchID}
	group by bs.PtCardID
) SummedStats
join PtCard c on SummedStats.PtCardID = c.PtCardID
order by SummedStats.PA DESC
		`
	}

	private addBattingRateStats (summedStats: TournamentBattingStatsSum[]): TournamentBattingStats[] {

		return summedStats.map(stats => {
		
			const computedStats1 = {
				...stats,
				"AVG": parseFloat(((stats.H) / (stats.AB)).toFixed(3)),
				"OBP": parseFloat(((stats.H + stats.BB + stats.IBB + stats.HP) / (stats.AB + stats.BB + stats.IBB + stats.HP + stats.SF)).toFixed(3)),
				"SLG": parseFloat(((stats.TB) / (stats.AB)).toFixed(3)),
			}

			return {
				...computedStats1,
				"ISO": parseFloat((computedStats1.SLG - computedStats1.AVG).toFixed(3)),
				"OPS": parseFloat((computedStats1.SLG + computedStats1.OBP).toFixed(3)), 
			}

		});

	}

	private addPitchingRateStats (summedStats: TournamentPitchingStatsSum[]): TournamentPitchingStats[] {

        return summedStats.map(stats => {
        
            return {
                ...stats,
                "K/9": parseFloat((((stats.K / (stats.Outs / 3)) * 9).toFixed(3))),
                "BB/9": parseFloat((((stats.BB / (stats.Outs / 3)) * 9).toFixed(3))),
                "HR/9": parseFloat((((stats.HR / (stats.Outs / 3)) * 9).toFixed(3))),
                "H/9": parseFloat((((stats.HA / (stats.Outs / 3)) * 9).toFixed(3))),
                "ERA": parseFloat((((stats.ER / (stats.Outs / 3)) * 9).toFixed(3))),
                "IP": parseFloat(Math.floor(stats.Outs / 3) + '.' + stats.Outs % 3)
            }

        });

	}

}