import { PitchingStatsFilter, IPitchingStatsGetter } from ".";
import { Database } from "../database/Database";
import { TournamentPitchingStats } from "../../userInterfaceTypes";
import { DatabaseRecord, Throws, TournamentPitchingStatsSum } from "../types";

export class LocalSqlitePitchingStatsGetter implements IPitchingStatsGetter {
    
    database: Database;

    constructor (database: Database) {
        this.database = database;
    }

    async getTournamentStatsAsync (pitchingStatsFilter: PitchingStatsFilter) {
        
        const pitchingStatsGetScript = this.getTournamentPitchingStatsScript(pitchingStatsFilter);
        const unmappedPitchingStats = await this.database.getAll(pitchingStatsGetScript);
        const summedPitchingStats = this.mapTournamentStats(unmappedPitchingStats);
        return this.addRateStats(summedPitchingStats);

    }

    private mapTournamentStats (pitchingStats: DatabaseRecord[]): TournamentPitchingStatsSum[] {

        return pitchingStats.map(stats => {

            const summedPitchingStats: TournamentPitchingStatsSum = {
                CardTitle: stats.CardTitle as string,
                PtCardID: stats.PtCardID as number,
                CardValue: stats.CardValue as number,
                Throws: Throws[stats.Position as number],
                G: stats.G as number,
                GS: stats.GS as number,
                Outs: stats.Outs as number,
                K: stats.K as number,
                BB: stats.BB as number,
                HR: stats.HR as number,
                HA: stats.HA as number,
                ER: stats.ER as number,
            };

            return summedPitchingStats;

        })

    }

    private getTournamentPitchingStatsScript = (filter: PitchingStatsFilter) => {
        return `
select c.CardTitle, c.PtCardID, c.CardValue, c.Position,  SummedStats.*
from (
	select PtCardID, SUM([G]) [G], SUM([GS]) [GS], SUM([W]) [W], SUM([L]) [L], SUM([WIN%]) [WIN%], SUM([SVO]) [SVO], SUM([SV]) [SV], SUM([SV%]) [SV%], SUM([BS]) [BS], SUM([BS%]) [BS%], SUM([HLD]) [HLD], SUM([SD]) [SD], SUM([MD]) [MD], SUM([BF]) [BF], SUM([AB]) [AB], SUM([HA]) [HA], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([TB]) [TB], SUM([R]) [R], SUM([ER]) [ER], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([K]) [K], SUM([HP]) [HP], SUM(ps.[ERA]) [ERA], SUM([AVG]) [AVG], SUM([OBP]) [OBP], SUM([SLG]) [SLG], SUM([OPS]) [OPS], SUM(ps.[BABIP]) [BABIP], SUM([WHIP]) [WHIP], SUM([BRA/9]) [BRA/9], SUM([HR/9]) [HR/9], SUM([H/9]) [H/9], SUM([BB/9]) [BB/9], SUM([K/9]) [K/9], SUM([K/BB]) [K/BB], SUM([K%]) [K%], SUM([BB%]) [BB%], SUM([SH]) [SH], SUM([SF]) [SF], SUM([WP]) [WP], SUM([BK]) [BK], SUM([CI]) [CI], SUM(ps.[DP]) [DP], SUM([RA]) [RA], SUM([GF]) [GF], SUM([IR]) [IR], SUM([IRS]) [IRS], SUM([IRS%]) [IRS%], SUM([LOB%]) [LOB%], SUM([pLi]) [pLi], SUM([GF%]) [GF%], SUM([QS]) [QS], SUM([QS%]) [QS%], SUM([CG]) [CG], SUM([CG%]) [CG%], SUM([SHO]) [SHO], SUM([PPG]) [PPG], SUM([RS]) [RS], SUM([RSG]) [RSG], SUM([PI]) [PI], SUM(ps.[GB]) [GB], SUM([FB]) [FB], SUM([GO%]) [GO%], SUM([SB]) [SB], SUM([CS]) [CS], SUM([ERA+]) [ERA+], SUM([FIP]) [FIP], ROUND(SUM([WPA]),3) [WPA], ROUND(SUM([WAR]),1) [WAR], ROUND(SUM([rWAR]),1) [rWAR], ROUND(SUM([SIERA])) [SIERA], SUM(round([IP],0) * 3 + (case when instr(cast([IP] as text),'.') = 0 then 0 else substr(cast([IP] as text), instr(cast([IP] as text),'.')+1) end)) Outs
    from PitchingStats ps
    join StatsBatch sb on ps.StatsBatchID = sb.StatsBatchID
    where TournamentTypeID = ${filter.TournamentTypeID}
    ${filter.TournamentTimeRange ? `AND (UNIXEPOCH(TournamentStartDate) >= UNIXEPOCH('${filter.TournamentTimeRange.StartDate}') AND UNIXEPOCH(TournamentStartDate) <= UNIXEPOCH('${filter.TournamentTimeRange.EndDate}'))` : ""}
    group by ps.PtCardID
) SummedStats
join PtCard c on SummedStats.PtCardID = c.PtCardID
    `
    }

    private addRateStats (summedStats: TournamentPitchingStatsSum[]): TournamentPitchingStats[] {

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