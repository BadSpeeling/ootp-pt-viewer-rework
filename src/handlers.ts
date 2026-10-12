import { Database } from "./backend/database/Database";

import { LiveUpdateRepository, TournamentTypeRepository } from './backend/database/repositories/';
import { mapLiveUpdate, mapTournamentTypes } from './backend/mappers';
import { LiveUpdate, TournamentType } from './userInterfaceTypes';

export async function createLiveUpdateHandlerAsync (database: Database, liveUpdateEffectiveDate: string): Promise<LiveUpdate> {
    
    const liveUpdateRepo = new LiveUpdateRepository(database);
	const liveUpdate = await liveUpdateRepo.createLiveUpdate(liveUpdateEffectiveDate);

	return mapLiveUpdate(liveUpdate);

}

export async function getTournamentTypesHandlerAsync (database: Database): Promise<TournamentType[]> {

	const tournamentTypeRepo = new TournamentTypeRepository(database);
	const tournamentTypes = await tournamentTypeRepo.getTournamentTypes();

	return mapTournamentTypes(tournamentTypes);

}