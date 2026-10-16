import { BattingStatsFilter } from ".";
import { TournamentBattingStats } from "../../userInterfaceTypes";

export interface IBattingStatsGetter {

    getTournamentStatsAsync: (battingStatsFilter: BattingStatsFilter) => Promise<TournamentBattingStats[]>

}