import { Database } from "./backend/database/Database";

import { LiveUpdateRepository, PtRosterRepository, TournamentTypeRepository } from './backend/database/repositories/';
import { mapLiveUpdate, mapPtRoster, mapTournamentTypes } from './backend/mappers';
import { LiveUpdate, TournamentType, PtCardRatings } from './userInterfaceTypes';
import { OotpDataExport } from "./backend/export-stats";

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

export async function getPtRosterHandlerAsync (database: Database, exportedPtRoster: OotpDataExport): Promise<PtCardRatings[]> {

	const ptRosterRepo = new PtRosterRepository(database, exportedPtRoster);
	const ptRoster = await ptRosterRepo.loadPtRoster();
	return mapPtRoster(ptRoster);

}