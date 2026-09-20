import { Database } from "./backend/database/Database";

import { LiveUpdateRepository } from './backend/database/repositories/';
import { LiveUpdateMapper } from './backend/database/mappers';
import { LiveUpdate } from './userInterfaceTypes';

export async function createLiveUpdateHandlerAsync (database: Database, liveUpdateEffectiveDate: string): Promise<LiveUpdate> {
    
    const liveUpdateRepo = new LiveUpdateRepository(database);
	const liveUpdate = await liveUpdateRepo.createLiveUpdate(liveUpdateEffectiveDate);

	return LiveUpdateMapper.mapLiveUpdate(liveUpdate);

}