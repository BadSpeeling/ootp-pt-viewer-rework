import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { ProjectJsonModelReader } from '../src/backend/database-creator'
import { DatatableModel, OotpExportDataColumn } from '../src/backend/types';

import { PtCardImporter } from '../src/backend/PtCardImporter';

import { initializeDatabase } from './util'
import { FakeOneCardLiveUpdateReader, FakeOnlyNonLiveUpdateReader } from './fakes/OotpExportReader';
import { OotpCsvExportReader } from '../src/backend/export-reader';
import { ImportCardResult } from '../src/backend/types';
import { LiveUpdate, PtCard, TournamentType } from '../src/backend/database/databaseTypes';
import { DataInserter } from '../src/backend/database/DataInserter';

const databaseFilePath = ['E:','ootp_data','sqlite','test','data-exports']

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

test('Read and write real OOTP27 pt_card_list file', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        }
    ]

    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    

    const ptCardListModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("ptCardListColumns.json")
    const ptCardListModel = await ptCardListModelReader.getJsonModels();
    const csvReader = new OotpCsvExportReader(ptCardListModel, [process.cwd(), 'tests', 'data', 'real_pt_card_list.csv']);

    const cardImporter = new PtCardImporter(db, csvReader);
    const importResult = await cardImporter.importPtCardsAsync();

    expect(importResult === ImportCardResult.SUCCESS).toBeTruthy();

    const result = await db.getAll("select * from PtCard")
    expect(result.length === 9).toBeTruthy();

    const result1 = result.find(r => r.CardID === 85352);
    expect(result1).toBeTruthy();
    expect(result1!["brefid"] === 'zobribe01').toBeTruthy();
    expect(result1!["date"] === '2026-05-12').toBeTruthy();
    expect(result1!["packs"] === 1).toBeTruthy();
    expect(result1!["LiveUpdateID"] === 0).toBeTruthy();

    const liveCardResult = result.find(r => r.CardID === 81776);
    expect(liveCardResult).toBeTruthy();
    expect(liveCardResult!["LiveUpdateID"] === 1).toBeTruthy();

})

test('Do not update because live update occured', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        }
    ]
    const ptCards: PtCard[] = [
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 1,
            LiveUpdateID: 1,
            PtCardID: 1,
            CardValue: 100
        }
    ]
    
    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");

    const cardImporter = new PtCardImporter(db, new FakeOneCardLiveUpdateReader());
    const importResult = await cardImporter.importPtCardsAsync();

    expect(importResult === ImportCardResult.LIVE_UPDATE_NEEDED).toBeTruthy();

})

test('Succeed bc only new cards are non-live', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    const datatableModels = await datatableModelReader.getJsonModels()

    const liveUpdates: LiveUpdate[] = [
        {
            LiveUpdateID: 1,
            EffectiveDate: '2026-01-01'
        }
    ]
    const ptCards: PtCard[] = [
        {
            CardID: 1,
            CardTitle: 'Bryce Harper',
            CardType: 1,
            LiveUpdateID: 1,
            PtCardID: 1,
            CardValue: 100
        },
        {
            CardID: 2,
            CardTitle: 'Mike Schmidt',
            CardType: 2,
            LiveUpdateID: 0,
            PtCardID: 2,
            CardValue: 100
        },        
    ]
    
    const dataInserter = new DataInserter(db, datatableModels);
    await dataInserter.insertRawDataAsync(liveUpdates, "LiveUpdate");    
    await dataInserter.insertRawDataAsync(ptCards, "PtCard");

	const ptCardListModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("ptCardListColumns.json")
	const ptCardListModel = await ptCardListModelReader.getJsonModels();

    const reader = new FakeOnlyNonLiveUpdateReader(ptCardListModel);

    const cardImporter = new PtCardImporter(db, reader);
    const importResult = await cardImporter.importPtCardsAsync();

    expect(importResult === ImportCardResult.SUCCESS).toBeTruthy();
    
    const currentPtCards = await db.getAllMapped<{cnt:number}>('select count(*) as cnt from PtCard')
    expect(currentPtCards[0].cnt === reader.getRowCount()).toBeTruthy();

})