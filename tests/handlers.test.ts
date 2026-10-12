import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { createLiveUpdateHandlerAsync, getTournamentTypesHandlerAsync } from '../src/handlers'
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { DatatableModel, LiveUpdate, TournamentType } from '../src/backend/types';
import { initializeDatabase } from './util';
import { DataInserter } from '../src/backend/database/DataInserter';

const databaseFilePath = ['E:','ootp_data','sqlite','test','handlers']

beforeAll(() => {

    const testPath = path.join(...databaseFilePath);

    //if the testing folder doesn't exist, create it
    if (!fs.existsSync(testPath)) {
        fs.mkdirSync(testPath);
    }

})

afterAll(() => {

    fs.readdir(path.join(...databaseFilePath), (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(...databaseFilePath, file), (err) => {
                if (err) throw err;
            });
        }
    });

})

test('Create LiveUpdate handler', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const liveUpdateResult = await createLiveUpdateHandlerAsync(db, '2026-01-01');

    const liveUpdateDB = await db.getMapped<LiveUpdate>("select LiveUpdateID, EffectiveDate from LiveUpdate limit 1");
    expect(liveUpdateDB.LiveUpdateID === liveUpdateResult?.LiveUpdateID).toBeTruthy();
    expect(liveUpdateDB.EffectiveDate === liveUpdateResult?.EffectiveDate).toBeTruthy();

})

test('Get Tournaments handler', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const tournamentTypes: TournamentType[] = [
        {
            TournamentTypeID: 1,
            Name: 'Test Tournament',
            CardRestriction: 'None',
            MaxOverall: 100,
            IsQuick: false,
            IsCap: false,
            IsLive: false,
            CapAmount: 1000
        },
        {
            TournamentTypeID: 2,
            Name: 'Other Test Tournament',
            CardRestriction: 'None',
            MaxOverall: 100,
            IsQuick: false,
            IsCap: false,
            IsLive: false,
            CapAmount: 1000
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType");    

    const loadedTournamentTypes = await getTournamentTypesHandlerAsync(db);
    
    const tournament1 = loadedTournamentTypes.find(t => t.TournamentTypeID === 1);
    expect(tournament1).toBeTruthy();
    expect(tournament1!.TournamentName === "Test Tournament").toBeTruthy();

    const tournament2 = loadedTournamentTypes.find(t => t.TournamentTypeID === 2);
    expect(tournament2).toBeTruthy();
    expect(tournament2!.TournamentName === "Other Test Tournament").toBeTruthy();

})