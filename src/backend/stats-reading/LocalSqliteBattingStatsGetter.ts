import { BattingStatsFilter, IBattingStatsGetter } from ".";
import { Database } from "../database/Database";
import { TournamentBattingStats } from "../../userInterfaceTypes";
import { Bats, DatabaseRecord, Position, TournamentBattingStatsSum } from "../types";

export class LocalSqliteBattingStatsGetter implements IBattingStatsGetter {
    
    database: Database;

    constructor (database: Database) {
        this.database = database;
    }

    async getTournamentStatsAsync (battingStatsFilter: BattingStatsFilter) {
        
        const battingStatsGetScript = this.getTournamentBattingStatsScript(battingStatsFilter);
        const unmappedBattingStats = await this.database.getAll(battingStatsGetScript);
        const summedBattingStats = this.mapTournamentStats(unmappedBattingStats);
        return this.addRateStats(summedBattingStats);

    }

    private mapTournamentStats (battingStats: DatabaseRecord[]): TournamentBattingStatsSum[] {

        return battingStats.map(stats => {

            const summedBattingStats: TournamentBattingStatsSum = {
                CardTitle: stats.CardTitle as string,
                PtCardID: stats.PtCardID as number,
                CardValue: stats.CardValue as number,
                Position: Position[stats.Position as number],
                Bats: Bats[stats.Bats as number],
                H: stats.H as number,
                AB: stats.AB as number,
                BB: stats.BB as number,
                IBB: stats.IBB as number,
                HP: stats.HP as number,
                SF: stats.SF as number,
                PA: stats.PA as number,
                TB: stats.TB as number,
            };

            return summedBattingStats;

        })

    }

    private getTournamentBattingStatsScript = (filter: BattingStatsFilter) => {
        return `
select c.PtCardID, c.CardTitle, c.CardValue, c.Position, c.Bats, SummedStats.*
from (
	select PtCardID, SUM([G]) [G], SUM([GS]) [GS], SUM([PA]) [PA], SUM([AB]) [AB], SUM([H]) [H], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([RBI]) [RBI], SUM([R]) [R], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([HP]) [HP], SUM([SH]) [SH], SUM([SF]) [SF], SUM([CI]) [CI], SUM([SO]) [SO], SUM([GIDP]) [GIDP], SUM([EBH]) [EBH], SUM([TB]) [TB], SUM([RC]) [RC], SUM([WPA]) [WPA], SUM([wRC]) [wRC], ROUND(SUM([wRAA]),1) [wRAA], ROUND(SUM([WAR]),1) [WAR], SUM([SB]) [SB], SUM([CS]) [CS], SUM([BatR]) [BatR], SUM([wSB]) [wSB], SUM([UBR]) [UBR], SUM([BsR]) [BsR]
	from BattingStats bs
	join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID
    where TournamentTypeID = ${filter.TournamentTypeID}
    ${filter.TournamentTimeRange ? `AND (UNIXEPOCH(TournamentStartDate) >= UNIXEPOCH('${filter.TournamentTimeRange.StartDate}') AND UNIXEPOCH(TournamentStartDate) <= UNIXEPOCH('${filter.TournamentTimeRange.EndDate}'))` : ""}
    ${filter.TeamName ? `AND bs.TeamName = '${filter.TeamName}'` : ""}
    group by bs.PtCardID
) SummedStats
join PtCard c on SummedStats.PtCardID = c.PtCardID
order by SummedStats.PA DESC
    `
    }

    private addRateStats (summedStats: TournamentBattingStatsSum[]): TournamentBattingStats[] {

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

}