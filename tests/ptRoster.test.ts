import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { DatatableModel, OotpExportDataColumn } from '../src/backend/types';
import { initializeDatabase } from './util';

import { LiveUpdate, PtCard } from '../src/backend/database/databaseTypes';
import { DataInserter } from '../src/backend/database/DataInserter';
import { OotpDataExport } from '../src/backend/export-stats';

import { getPtRosterHandlerAsync } from '../src/handlers'

const databaseFilePath = ['E:','ootp_data','sqlite','test','pt_roster_test']

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

test('Load simple PT Roster test', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const ptRosterModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("ptRoster.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels();
    const ptRosterModel = await ptRosterModelReader.getJsonModels();

    const ptCards: PtCard[] = [
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 2,
            LiveUpdateID: 0,
            PtCardID: 1,
            CardValue: 100            
        },
        {
            CardID: 2,
            CardTitle: 'Kyle Schwarber',
            CardType: 2,
            LiveUpdateID: 0,
            PtCardID: 2,
            CardValue: 100
        },
        {
            CardID: 3,
            CardTitle: 'Cris Sanchez',
            CardType: 2,
            LiveUpdateID: 0,
            PtCardID: 3,
            CardValue: 100
        }
    ]
    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    

    const ptRoster = new OotpDataExport(ptRosterModel);
    ptRoster.addStatsRow(["1", "Active Roster"]);
    ptRoster.addStatsRow(["3", "Reserve Roster"]);

    const loadedPtRoster = await getPtRosterHandlerAsync(db, ptRoster);
    expect(loadedPtRoster.length === 3).toBeTruthy();

});