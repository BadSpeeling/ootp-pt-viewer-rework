import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';
import { ProjectJsonModelReader } from '../src/backend/database-creator';
import { DatatableModel } from '../src/backend/types';
import { initializeDatabase } from './util';

const databaseFilePath = ['E:','ootp_data','sqlite','test','database-tests']

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


test('Database session multiline execution', async () => {

    const datatableModelReader = new ProjectJsonModelReader<DatatableModel>("tableColumns.json");
    const db = await initializeDatabase(databaseFilePath, datatableModelReader);

    await db.openConnection();
    await db.execute('CREATE TABLE temp.Test (Col1 Text);');
    await db.execute('INSERT INTO temp.Test VALUES ("Hello");');
    const result = await db.getAllMapped<{Col1: string}>('SELECT Col1 FROM temp.Test;');
    await db.closeConnection();

    expect(result.length === 1).toBeTruthy();

});