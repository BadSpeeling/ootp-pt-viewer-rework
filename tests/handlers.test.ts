import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { createLiveUpdateHandlerAsync, deleteTournamentHandlerAsync, getTournamentTypesHandlerAsync } from '../src/handlers'
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { DatatableModel } from '../src/backend/types';
import { LiveUpdate, TournamentType } from '../src/backend/database/DatabaseTypes'
import { initializeDatabase } from './util';
import { DataInserter } from '../src/backend/database/DataInserter';
import { LiveUpdateRepository } from '../src/backend/database/repositories';
import { BattingStats, PitchingStats, StatsBatch } from '../src/backend/database/DatabaseTypes';

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

test('Get LiveUpdates handler', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const tournamentTypes: LiveUpdate[] = [
        {
            EffectiveDate: '2026-01-01',
            LiveUpdateID: 1
        },
        {
            EffectiveDate: '2026-02-01',
            LiveUpdateID: 2
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "LiveUpdate");    

    const repo = new LiveUpdateRepository(db);
    const liveUpdates = await repo.getLiveUpdates();

    expect(liveUpdates.length === 2).toBeTruthy();
    expect(liveUpdates.find(lu => lu.LiveUpdateID === 1)?.EffectiveDate === '2026-01-01').toBeTruthy();
    expect(liveUpdates.find(lu => lu.LiveUpdateID === 2)?.EffectiveDate === '2026-02-01').toBeTruthy();
    
})

test('Create LiveUpdate handler', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const liveUpdateResult = await createLiveUpdateHandlerAsync(db, '2026-01-01');

    await db.openConnection();
    const liveUpdateDB = await db.getMapped<LiveUpdate>("select LiveUpdateID, EffectiveDate from LiveUpdate limit 1");
    await db.closeConnection();
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
            IsQuick: 0,
            IsCap: 0,
            IsLive: 0,
            CapAmount: 1000
        },
        {
            TournamentTypeID: 2,
            Name: 'Other Test Tournament',
            CardRestriction: 'None',
            MaxOverall: 100,
            IsQuick: 0,
            IsCap: 0,
            IsLive: 0,
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

test('Delete StatsBatch', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);
    const datatableModels = await datatableModelReader.getJsonModels();

    const statsBatches: Partial<StatsBatch>[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-01',
            Timestamp: '2026-01-01',
        },
        {
            StatsBatchID: 2,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-02-01',
            Timestamp: '2026-02-01',
        },
    ];
    const battingStats: Partial<BattingStats>[] = [
        { BattingStatsID: 1, TeamName: 'Test Team', PtCardID: 1, StatsBatchID: 1, G: 1 },
        { BattingStatsID: 2, TeamName: 'Test Team', PtCardID: 1, StatsBatchID: 2, G: 1 },
    ];
    const pitchingStats: Partial<PitchingStats>[] = [
        { PitchingStatsID: 1, TeamName: 'Test Team', PtCardID: 1, StatsBatchID: 1, G: 1 },
        { PitchingStatsID: 2, TeamName: 'Test Team', PtCardID: 1, StatsBatchID: 2, G: 1 },
    ];
    const tournamentType: Partial<TournamentType>[] = [{
        TournamentTypeID: 1,
        Name: 'Test Tournament',
        CardRestriction: 'None',
        MaxOverall: 100,
        IsQuick: 0,
        IsCap: 0,
        IsLive: 0,
        CapAmount: 1000,
    }];

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentType, "TournamentType");
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch");
    await dataInserter.insertRawDataAsync(battingStats, "BattingStats");
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    await deleteTournamentHandlerAsync(db, 1);

    await db.openConnection();
    const remainingBatches = await db.getAll("SELECT StatsBatchID FROM StatsBatch ORDER BY StatsBatchID");
    const remainingBattingStats = await db.getAll("SELECT StatsBatchID FROM BattingStats ORDER BY StatsBatchID");
    const remainingPitchingStats = await db.getAll("SELECT StatsBatchID FROM PitchingStats ORDER BY StatsBatchID");
    await db.closeConnection();

    expect(remainingBatches).toEqual([{ StatsBatchID: 2 }]);
    expect(remainingBattingStats).toEqual([{ StatsBatchID: 2 }]);
    expect(remainingPitchingStats).toEqual([{ StatsBatchID: 2 }]);

})