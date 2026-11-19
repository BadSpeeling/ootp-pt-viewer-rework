import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { ProjectJsonModelReader } from '../src/backend/database-creator'
import { DatatableModel } from '../src/backend/types';
import { initializeDatabase } from './util'
import { DataInserter } from '../src/backend/database/DataInserter';
import { BattingStats, PitchingStats, PtCard, StatsBatch, TournamentType } from '../src/backend/database/DatabaseTypes';
import { TournamentRepository } from '../src/backend/database/repositories';
import { getRecentTournamentResultsHandlerAsync } from '../src/handlers';

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

    const results = await getRecentTournamentResultsHandlerAsync(db, {
        TeamName: "Lil Dicky",
        TournamentCount: 50,
        TournamentTypeID: 1,
    });
    
    expect(results.length === 1).toBeTruthy();
    const tournamentResult = results[0];
    expect(tournamentResult.W === 4).toBeTruthy();
    expect(tournamentResult.L === 5).toBeTruthy();
    expect(tournamentResult.StatsBatchID === 1).toBeTruthy();
    expect(tournamentResult.TeamName === 'Lil Dicky').toBeTruthy();
    expect(tournamentResult.TournamentName === "Test Name").toBeTruthy();

});

// test('Multiple tournaments', async () => {

//     const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
//     const db = await initializeDatabase(databaseFilePath, datatableModelReader);

//     const datatableModels = await datatableModelReader.getJsonModels()

//     const tournamentTypes: Partial<TournamentType>[] = [
//         {
//             TournamentTypeID: 1,          
//             Name: "Type 1",  
//         },
//         {
//             TournamentTypeID: 2,          
//             Name: "Type 2",  
//         }
//     ]

//     const statsBatches: Partial<StatsBatch>[] = [
//         {
//             StatsBatchID: 1,
//             TournamentTypeID: 1,
//             TournamentStartDate: '2026-01-01'            
//         },
//         {
//             StatsBatchID: 2,
//             TournamentTypeID: 2,
//             TournamentStartDate: '2026-01-01'            
//         }
//     ]

//     const pitchingStats: Partial<PitchingStats>[] = [
//         {
//             PitchingStatsID: 1,
//             StatsBatchID: 1,
//             PtCardID: 1,
//             W: 0,
//             L: 1,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 2,
//             StatsBatchID: 1,
//             PtCardID: 2,
//             W: 3,
//             L: 1,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 3,
//             StatsBatchID: 2,
//             PtCardID: 4,
//             W: 1,
//             L: 3,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 4,
//             StatsBatchID: 2,
//             PtCardID: 2,
//             W: 3,
//             L: 3,
//             TeamName: "Lil Dicky"
//         }
//     ]

//     const dataInserter = new DataInserter(db, datatableModels);
//     await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
//     await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
//     await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

//     const results = await getRecentTournamentResultsHandlerAsync(db, {
//         TeamName: "Lil Dicky",
//         TournamentCount: 50,
//         Timeframe: {
//             StartDate: '2026-01-01',
//             EndDate: '2099-12-31',
//         }
//     });

//     expect(results.length === 2).toBeTruthy();

//     const tournamentResult1 = results.find(r => r.StatsBatchID === 1)!;
//     expect(tournamentResult1.W === 3).toBeTruthy();
//     expect(tournamentResult1.L === 2).toBeTruthy();
//     expect(tournamentResult1.StatsBatchID === 1).toBeTruthy();
//     expect(tournamentResult1.TeamName === 'Lil Dicky').toBeTruthy();
//     expect(tournamentResult1.TournamentName === "Type 1").toBeTruthy();

//     const tournamentResult2 = results.find(r => r.StatsBatchID === 2)!;
//     expect(tournamentResult2.W === 4).toBeTruthy();
//     expect(tournamentResult2.L === 6).toBeTruthy();
//     expect(tournamentResult2.StatsBatchID === 2).toBeTruthy();
//     expect(tournamentResult2.TeamName === 'Lil Dicky').toBeTruthy();
//     expect(tournamentResult2.TournamentName === "Type 2").toBeTruthy();

// });

// test('Exclude tournament outside of dates', async () => {

//     const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
//     const db = await initializeDatabase(databaseFilePath, datatableModelReader);

//     const datatableModels = await datatableModelReader.getJsonModels()

//     const tournamentTypes: Partial<TournamentType>[] = [
//         {
//             TournamentTypeID: 1,          
//             Name: "Type 1",  
//         }
//     ]

//     const statsBatches: Partial<StatsBatch>[] = [
//         {
//             StatsBatchID: 1,
//             TournamentTypeID: 1,
//             TournamentStartDate: '2026-01-01'            
//         },
//         {
//             StatsBatchID: 2,
//             TournamentTypeID: 1,
//             TournamentStartDate: '2027-01-01'            
//         }
//     ]

//     const pitchingStats: Partial<PitchingStats>[] = [
//         {
//             PitchingStatsID: 1,
//             StatsBatchID: 1,
//             PtCardID: 1,
//             W: 0,
//             L: 1,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 2,
//             StatsBatchID: 1,
//             PtCardID: 2,
//             W: 3,
//             L: 1,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 3,
//             StatsBatchID: 2,
//             PtCardID: 4,
//             W: 1,
//             L: 3,
//             TeamName: "Lil Dicky"
//         },
//         {
//             PitchingStatsID: 4,
//             StatsBatchID: 2,
//             PtCardID: 2,
//             W: 3,
//             L: 3,
//             TeamName: "Lil Dicky"
//         }
//     ]

//     const dataInserter = new DataInserter(db, datatableModels);
//     await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
//     await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
//     await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

//     const results = await getRecentTournamentResultsHandlerAsync(db, {
//         TeamName: "Lil Dicky",
//         TournamentCount: 50,
//         Timeframe: {
//             StartDate: '2026-12-31',
//             EndDate: '2099-12-31',
//         },
//     });

//     expect(results.length === 1).toBeTruthy();

//     const tournamentResult = results.find(r => r.StatsBatchID === 2)!;
//     expect(tournamentResult.W === 4).toBeTruthy();
//     expect(tournamentResult.L === 6).toBeTruthy();
//     expect(tournamentResult.StatsBatchID === 2).toBeTruthy();
//     expect(tournamentResult.TeamName === 'Lil Dicky').toBeTruthy();
//     expect(tournamentResult.TournamentName === "Type 1").toBeTruthy();
//     expect(tournamentResult.TournamentStartDate === "2027-01-01").toBeTruthy();

// });

test('Limit tournament counts', async () => {

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
            StatsBatchID: 2,
            PtCardID: 1,
            W: 0,
            L: 1,
            TeamName: "Lil Dicky"
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const results = await getRecentTournamentResultsHandlerAsync(db, {
        TeamName: "Lil Dicky",
        TournamentCount: 1,
    });

    expect(results.length === 1).toBeTruthy();

});

test('Specific tournament type', async () => {

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
        },
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
            StatsBatchID: 2,
            PtCardID: 1,
            W: 0,
            L: 1,
            TeamName: "Lil Dicky"
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType"); 
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch"); 
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const results = await getRecentTournamentResultsHandlerAsync(db, {
        TeamName: "Lil Dicky",
        TournamentTypeID: 1,
    });

    expect(results.length === 1).toBeTruthy();
    expect(results[0].TournamentTypeID === 1);

});

test('Get full tournament result', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);
    const datatableModels = await datatableModelReader.getJsonModels();

    const tournamentTypes: Partial<TournamentType>[] = [
        {
            TournamentTypeID: 1,
            Name: 'Test Tournament',
        }
    ];
    const statsBatches: Partial<StatsBatch>[] = [
        {
            StatsBatchID: 1,
            TournamentTypeID: 1,
            TournamentStartDate: '2026-01-01',
        }
    ];
    const ptCards: Partial<PtCard>[] = [
        {
            PtCardID: 1,
            CardTitle: 'Test Card 1',
            CardID: 1,
            CardValue: 100,
            Position: 1,
            Bats: 1,
            Throws: 1,
        },
        {
            PtCardID: 2,
            CardTitle: 'Test Card 2',
            CardID: 2,
            CardValue: 100,
            Position: 1,
            Bats: 1,
            Throws: 1,
        },
        {
            PtCardID: 3,
            CardID: 3,            
            CardTitle: 'Test Card 3',
            CardValue: 100,
            Position: 1,
            Bats: 1,
            Throws: 1,
        }
    ];
    const battingStats: Partial<BattingStats>[] = [
        {
            BattingStatsID: 1,
            TeamName: 'Lil Dicky',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 2,
            GS: 1,
            PA: 10,
            AB: 8,
            H: 3,
            HR: 1,
            BB: 2,
            IBB: 0,
            HP: 0,
            SH: 0,
            SF: 0,
            SO: 2,
            TB: 6,
            WAR: 1.2,
            SB: 1,
            CS: 0,
        },
        {
            BattingStatsID: 2,
            TeamName: 'Lil Dicky',
            PtCardID: 2,
            StatsBatchID: 1,
            G: 3,
            GS: 1,
            PA: 20,
            AB: 18,
            H: 6,
            HR: 2,
            BB: 1,
            SO: 3,
            TB: 12,
            WAR: 2.0,
        },
        {
            BattingStatsID: 3,
            TeamName: 'Lil Dicky',
            PtCardID: 3,
            StatsBatchID: 1,
            G: 1,
            PA: 30,
            AB: 25,
            H: 8,
            HR: 3,
            BB: 4,
            SO: 5,
            TB: 15,
            WAR: 3.1,
        },
        {
            BattingStatsID: 4,
            TeamName: 'Lil Dicky',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 4,
            GS: 2,
            PA: 40,
            AB: 35,
            H: 10,
            HR: 4,
            BB: 5,
            SO: 6,
            TB: 20,
            WAR: 4.2,
        },
        {
            BattingStatsID: 5,
            TeamName: 'Lil Dicky',
            PtCardID: 2,
            StatsBatchID: 1,
            G: 5,
            GS: 3,
            PA: 50,
            AB: 45,
            H: 15,
            HR: 5,
            BB: 6,
            SO: 7,
            TB: 25,
            WAR: 5.3,
        }
    ];
    const pitchingStats: Partial<PitchingStats>[] = [
        {
            PitchingStatsID: 1,
            TeamName: 'Lil Dicky',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 3,
            GS: 2,
            W: 2,
            L: 1,
            K: 5,
            BB: 1,
            HR: 0,
            HA: 4,
            ER: 2,
            IP: 7.1,
        },
        {
            PitchingStatsID: 2,
            TeamName: 'Lil Dicky',
            PtCardID: 2,
            StatsBatchID: 1,
            G: 4,
            GS: 3,
            W: 1,
            L: 0,
            K: 3,
            BB: 2,
            HR: 1,
            HA: 5,
            ER: 3,
            IP: 8,
        },
        {
            PitchingStatsID: 3,
            TeamName: 'Lil Dicky',
            PtCardID: 3,
            StatsBatchID: 1,
            G: 5,
            GS: 4,
            W: 0,
            L: 1,
            K: 6,
            BB: 3,
            HR: 2,
            HA: 6,
            ER: 4,
            IP: 9,
        },
        {
            PitchingStatsID: 4,
            TeamName: 'Lil Dicky',
            PtCardID: 1,
            StatsBatchID: 1,
            G: 6,
            GS: 5,
            W: 3,
            L: 2,
            K: 4,
            BB: 4,
            HR: 3,
            HA: 7,
            ER: 5,
            IP: 10,
        },
        {
            PitchingStatsID: 5,
            TeamName: 'Lil Dicky',
            PtCardID: 2,
            StatsBatchID: 1,
            G: 7,
            GS: 6,
            W: 1,
            L: 1,
            K: 8,
            BB: 5,
            HR: 4,
            HA: 8,
            ER: 6,
            IP: 11,
        }
    ];

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(tournamentTypes, "TournamentType");
    await dataInserter.insertRawDataAsync(statsBatches, "StatsBatch");
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");
    await dataInserter.insertRawDataAsync(battingStats, "BattingStats");
    await dataInserter.insertRawDataAsync(pitchingStats, "PitchingStats");

    const repository = new TournamentRepository(db);
    const result = await repository.getTournamentResultAsync(1);

    expect(result.tournamentRecord).toMatchObject({
        W: 7,
        L: 5,
        StatsBatchID: 1,
        TournamentName: 'Test Tournament',
    });
    expect(result.tournamentBattingResult).toHaveLength(3);
    expect(result.tournamentBattingResult).toEqual(expect.arrayContaining([
        expect.objectContaining({
            PtCardID: 1,
            PA: 50,
            HR: 5,
        }),
        expect.objectContaining({
            PtCardID: 2,
            PA: 70,
            HR: 7,
        }),
        expect.objectContaining({
            PtCardID: 3,
            PA: 30,
            HR: 3,
        })
    ]));
    expect(result.tournamentPitchingResult).toEqual(expect.arrayContaining([
        expect.objectContaining({
            PtCardID: 1,
            G: 9,
            Outs: 52,
        }),
        expect.objectContaining({
            PtCardID: 2,
            G: 11,
            Outs: 57,
        }),
        expect.objectContaining({
            PtCardID: 3,
            G: 5,
            Outs: 27,
        })
    ]));

});