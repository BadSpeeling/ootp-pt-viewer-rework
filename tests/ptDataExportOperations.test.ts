import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { PtFolderSearcher } from '../src/backend/PtFolderSearcher'
import { PtDataExportState } from '../src/backend/types';

const testPtFolderRoot = 'E:\\ootp_data\\pt_folder_test\\';
const simpleFolderTest = testPtFolderRoot + 'simple_test\\';
const simpleFileTest = testPtFolderRoot + 'simple_file_test\\';
const doubleFileTest = testPtFolderRoot + 'double_file_test\\';
const manyFolderTest = testPtFolderRoot + 'many_folder_test\\';
let fileNameCounter = 1;

beforeAll(() => {

    //if the testing folder doesn't exist, create it
    if (!fs.existsSync(testPtFolderRoot)) {
        fs.mkdirSync(testPtFolderRoot, {recursive: true});
    }

})

afterAll(() => {

    fs.readdir(testPtFolderRoot, (err, files) => {
        if (err) throw err;

        for (const file of files) {

            fs.rm(testPtFolderRoot + file, { recursive: true, force: true }, () => {});

        }
    });

})

test('Simple many pt folder read', async() => {

    const fileName = "simpleFile";
    createTestFile(simpleFolderTest, null, fileName);
    createTestFile(simpleFolderTest, null, fileName);
    createTestFile(simpleFolderTest, null, fileName);

    const folders = await PtFolderSearcher.getAllPtFolders(simpleFolderTest.split('\\'));
    expect(folders.length === 3).toBeTruthy();

})

test('Find single file', async() => {

    const fileName = "simpleFile";
    const folderName = "simpleFolder"
    createTestFile(simpleFileTest, folderName, fileName);

    const ptFolder = getPtFolderPath(simpleFileTest, folderName);

    const foundFolders = await PtFolderSearcher.locateHtmlFiles([ptFolder])

    expect(foundFolders.length === 1).toBeTruthy();;
    const foundFolder = foundFolders[0];
    expect(foundFolder.exportState === PtDataExportState.READY_TO_READ).toBeTruthy();
    expect(foundFolder.fileName === fileName + '.html').toBeTruthy();;
    expect(foundFolder.ptFolder === ptFolder).toBeTruthy();;

})

test('Find folder with two files', async () => {

    const folderName = "manyFileFolder"
    createTestFile(doubleFileTest, folderName, null);
    createTestFile(doubleFileTest, folderName, null);

    const ptFolder = getPtFolderPath(doubleFileTest, folderName);

    const foundFolders = await PtFolderSearcher.locateHtmlFiles([ptFolder]);

    expect(foundFolders.length === 1).toBeTruthy();
    const foundFolder = foundFolders[0];
    expect(foundFolder.exportState === PtDataExportState.MULTIPLE_OUTPUT_FILES).toBeTruthy();
    expect(foundFolder.ptFolder === ptFolder).toBeTruthy();;

})

test('Find many folders', async () => {

    const singleFolder1 = "folder1";
    const singleFolder2 = "folder2";
    const duplicateFileFolder = "duplicate_folder";

    createTestFile(manyFolderTest, singleFolder1, null);
    createTestFile(manyFolderTest, singleFolder2, null);
    createTestFile(manyFolderTest, duplicateFileFolder, null);
    createTestFile(manyFolderTest, duplicateFileFolder, null);

    const foundFolders = await PtFolderSearcher.locateHtmlFiles([getPtFolderPath(manyFolderTest, singleFolder1), getPtFolderPath(manyFolderTest, singleFolder2), getPtFolderPath(manyFolderTest, duplicateFileFolder)]);
    expect(foundFolders.filter(f => f.exportState === PtDataExportState.READY_TO_READ).length === 2).toBeTruthy();
    expect(foundFolders.filter(f => f.exportState === PtDataExportState.MULTIPLE_OUTPUT_FILES).length === 1).toBeTruthy();

})

function createTestFile (root: string, ptFolderName: string | null, fileName: string | null) {

    const folderPath = getPtFolderPath(root, ptFolderName) + `news\\html\\temp\\`;

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true});
    }

    fs.writeFileSync(folderPath + (fileName ? fileName : getRandomName()) + ".html", '');

}

function getPtFolderPath (root: string, ptFolderName: string | null) {
    return root + `saved_games\\${ptFolderName ? ptFolderName : getRandomName()}.pt\\`;
}

function getRandomName () {
    return "file"+fileNameCounter++;
}