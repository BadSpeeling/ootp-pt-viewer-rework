import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { createLiveUpdateHandlerAsync } from '../src/handlers'
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { DatatableModel, LiveUpdate } from '../src/backend/types';
import { initializeDatabase } from './util';

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