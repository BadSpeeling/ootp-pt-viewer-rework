import { PitchingStatsFilter } from ".";
import { TournamentPitchingStats } from "../../userInterfaceTypes";

export interface IPitchingStatsGetter {

    getTournamentStatsAsync: (pitchingStatsFilter: PitchingStatsFilter) => Promise<TournamentPitchingStats[]>

}