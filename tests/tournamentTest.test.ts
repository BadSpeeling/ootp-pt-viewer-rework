import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { ProjectJsonModelReader } from '../src/backend/database-creator'
import { DatatableModel, OotpExportDataColumn, PitchingStats, StatsBatch, TournamentType } from '../src/backend/types';
import { initializeDatabase } from './util'
import { DataInserter } from '../src/backend/database/DataInserter';
import { TournamentRepository } from '../src/backend/database/repositories';


const databaseFilePath = ['E:','ootp_data','sqlite','test','tournament-tests']

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

test('Recent Tournament Result Query', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const tournamentTypes: Partial<TournamentType>[] = [
        {
            TournamentTypeID: 1,          
            Name: "Test Name",  
        }
    ]

    const statsBatches: Partial<StatsBatch>[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-01'            
        }
    ]

    const pitchingStats: Partial<PitchingStats>[] = [
        {
            PitchingStatsID: 1,
            StatsBatchID: 1,
            PtCardID: 1,
            W: 0,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 2,
            StatsBatchID: 1,
            PtCardID: 2,
            W: 3,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 3,
            StatsBatchID: 1,
            PtCardID: 4,
            W: 1,
            L: 3,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 4,
            StatsBatchID: 1,
            PtCardID: 2,
            W: 3,
            L: 3,
            TeamName: "not Lil Dicky"
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const repo = new TournamentRepository(db);
    const results = await repo.getRecentTournamentResultsAsync({
        TeamName: "Lil Dicky",
        TournamentCount: 50,
        TournamentTypeID: 1,
        Timeframe: {
            StartDate: '2026-01-01',
            EndDate: '2099-12-31',
        },
    })

    expect(results.length === 1).toBeTruthy();
    const tournamentResult = results[0];
    expect(tournamentResult.W === 4).toBeTruthy();
    expect(tournamentResult.L === 5).toBeTruthy();
    expect(tournamentResult.StatsBatchID === 1).toBeTruthy();
    expect(tournamentResult.TeamName === 'Lil Dicky').toBeTruthy();
    expect(tournamentResult.TournamentName === "Test Name").toBeTruthy();

});

test('Multiple tournaments', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const tournamentTypes: Partial<TournamentType>[] = [
        {
            TournamentTypeID: 1,          
            Name: "Type 1",  
        },
        {
            TournamentTypeID: 2,          
            Name: "Type 2",  
        }
    ]

    const statsBatches: Partial<StatsBatch>[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-01'            
        },
        {
            StatsBatchID: 2,
            TournamentTypeID: 2,
            TournamentStartDate: '2026-01-01'            
        }
    ]

    const pitchingStats: Partial<PitchingStats>[] = [
        {
            PitchingStatsID: 1,
            StatsBatchID: 1,
            PtCardID: 1,
            W: 0,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 2,
            StatsBatchID: 1,
            PtCardID: 2,
            W: 3,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 3,
            StatsBatchID: 2,
            PtCardID: 4,
            W: 1,
            L: 3,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 4,
            StatsBatchID: 2,
            PtCardID: 2,
            W: 3,
            L: 3,
            TeamName: "Lil Dicky"
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const repo = new TournamentRepository(db);
    const results = await repo.getRecentTournamentResultsAsync({
        TeamName: "Lil Dicky",
        TournamentCount: 50,
        Timeframe: {
            StartDate: '2026-01-01',
            EndDate: '2099-12-31',
        },
    })

    expect(results.length === 2).toBeTruthy();

    const tournamentResult1 = results.find(r => r.StatsBatchID === 1)!;
    expect(tournamentResult1.W === 3).toBeTruthy();
    expect(tournamentResult1.L === 2).toBeTruthy();
    expect(tournamentResult1.StatsBatchID === 1).toBeTruthy();
    expect(tournamentResult1.TeamName === 'Lil Dicky').toBeTruthy();
    expect(tournamentResult1.TournamentName === "Type 1").toBeTruthy();

    const tournamentResult2 = results.find(r => r.StatsBatchID === 2)!;
    expect(tournamentResult2.W === 4).toBeTruthy();
    expect(tournamentResult2.L === 6).toBeTruthy();
    expect(tournamentResult2.StatsBatchID === 2).toBeTruthy();
    expect(tournamentResult2.TeamName === 'Lil Dicky').toBeTruthy();
    expect(tournamentResult2.TournamentName === "Type 2").toBeTruthy();

});

test('Exclude tournament outside of dates', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const tournamentTypes: Partial<TournamentType>[] = [
        {
            TournamentTypeID: 1,          
            Name: "Type 1",  
        }
    ]

    const statsBatches: Partial<StatsBatch>[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-01'            
        },
        {
            StatsBatchID: 2,
            TournamentTypeID: 1,
            TournamentStartDate: '2027-01-01'            
        }
    ]

    const pitchingStats: Partial<PitchingStats>[] = [
        {
            PitchingStatsID: 1,
            StatsBatchID: 1,
            PtCardID: 1,
            W: 0,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 2,
            StatsBatchID: 1,
            PtCardID: 2,
            W: 3,
            L: 1,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 3,
            StatsBatchID: 2,
            PtCardID: 4,
            W: 1,
            L: 3,
            TeamName: "Lil Dicky"
        },
        {
            PitchingStatsID: 4,
            StatsBatchID: 2,
            PtCardID: 2,
            W: 3,
            L: 3,
            TeamName: "Lil Dicky"
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const repo = new TournamentRepository(db);
    const results = await repo.getRecentTournamentResultsAsync({
        TeamName: "Lil Dicky",
        TournamentCount: 50,
        Timeframe: {
            StartDate: '2026-12-31',
            EndDate: '2099-12-31',
        },
    })

    expect(results.length === 1).toBeTruthy();

    const tournamentResult = results.find(r => r.StatsBatchID === 2)!;
    expect(tournamentResult.W === 4).toBeTruthy();
    expect(tournamentResult.L === 6).toBeTruthy();
    expect(tournamentResult.StatsBatchID === 2).toBeTruthy();
    expect(tournamentResult.TeamName === 'Lil Dicky').toBeTruthy();
    expect(tournamentResult.TournamentName === "Type 1").toBeTruthy();
    expect(tournamentResult.TournamentStartDate === "2027-01-01").toBeTruthy();

});