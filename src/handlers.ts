import { Database } from "./backend/database/Database";

import { LiveUpdateRepository, PtRosterRepository, TournamentRepository, TournamentTypeRepository } from './backend/database/repositories/';
import { mapLiveUpdate, mapPtRoster, mapTournamentTypes } from './backend/mappers';
import { LiveUpdate, TournamentType, PtCardRatings } from './userInterfaceTypes';
import { OotpDataExport } from "./backend/export-stats";
import { GetRecentTournamentResultsQuery } from "./backend/database/repositories/types";

export async function getLiveUpdatesHandlerAsync (database: Database): Promise<LiveUpdate[]> {

	const liveUpdateRepo = new LiveUpdateRepository(database);
	const liveUpdates = await liveUpdateRepo.getLiveUpdates();

	return liveUpdates.map(lu => mapLiveUpdate(lu));

}

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

export async function getRecentTournamentResultsHandlerAsync (database: Database, query: GetRecentTournamentResultsQuery) {

	const repo = new TournamentRepository(database);
    const tournamentResults = await repo.getRecentTournamentResultsAsync(query);
    return tournamentResults;

}

export async function deleteTournamentHandlerAsync (database: Database, statsBatchID: number) {

	const repo = new TournamentRepository(database);
	await repo.deleteTournamentAsync(statsBatchID);

}