import { LiveUpdate, TournamentType } from './types';
import { LiveUpdate as LiveUpdateUI, TournamentType as TournamentTypeUI } from '../userInterfaceTypes';

export function mapLiveUpdate (liveUpdate: LiveUpdate): LiveUpdateUI {
    return {
        ...liveUpdate   
    };
}

export function mapTournamentTypes (tournamentTypes: TournamentType[]): TournamentTypeUI[] {
    return tournamentTypes.map(tt => mapTournamentType(tt));
}

export function mapTournamentType (tournamentType: TournamentType): TournamentTypeUI {
    return {
        TournamentName: tournamentType.Name,
        TournamentTypeID: tournamentType.TournamentTypeID,
    }
}