import { test, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'node:fs'
import * as path from 'node:path';

import { PtFolderSearcher } from '../src/backend/PtFolderSearcher'
import { PtDataExportState } from '../src/backend/types';
import { PtFolderOperations } from '../src/backend/PtFolderOperations';

const testPtFolderRoot = ['E:','ootp_data','pt_folder_test'];
const simpleFolderTest = [...testPtFolderRoot, 'simple_test'];
const simpleFileTest = [...testPtFolderRoot, 'simple_file_test'];
const doubleFileTest = [...testPtFolderRoot, 'double_file_test'];
const manyFolderTest = [...testPtFolderRoot, 'many_folder_test'];
const deleteExportFileTest = [...testPtFolderRoot, 'delete_export_file_test'];
const errorTestFile = [...testPtFolderRoot, 'error_test'];

let fileNameCounter = 1;

beforeAll(() => {

    //if the testing folder doesn't exist, create it
    if (!fs.existsSync(path.join(...testPtFolderRoot))) {
        fs.mkdirSync(path.join(...testPtFolderRoot), {recursive: true});
    }

})

afterAll(() => {

    fs.readdir(path.join(...testPtFolderRoot), (err, files) => {
        if (err) throw err;

        for (const file of files) {

            fs.rm(path.join(...testPtFolderRoot, file), { recursive: true, force: true }, () => {});

        }
    });

})

test('Simple many pt folder read', async() => {

    const fileName = "simpleFile";
    createTestFile(simpleFolderTest, null, fileName);
    createTestFile(simpleFolderTest, null, fileName);
    createTestFile(simpleFolderTest, null, fileName);

    const folders = await PtFolderSearcher.getAllPtFolders(simpleFolderTest);
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
    expect(foundFolder.fileName === fileName + '.html').toBeTruthy();
    expect(path.join(...foundFolder.ptFolderPath) === path.join(...ptFolder)).toBeTruthy();

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
    expect(path.join(...foundFolder.ptFolderPath) === path.join(...ptFolder)).toBeTruthy();

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

test('Delete pt export file', async () => {

    const folder1 = "folder1";
    const file1 = "file1";
    const paths = createTestFile(deleteExportFileTest, folder1, file1);

    await PtFolderOperations.deletePtDataFile(paths.ptFolderPath, paths.ptDataExportFilePath[paths.ptDataExportFilePath.length-1]);

    const fileExists = fs.existsSync(path.join(...paths.ptDataExportFilePath));
    expect(fileExists).toBeFalsy();

})

test('Delete pt file non pt folder error', async () => {

    let errMsg = '';

    try {
        await PtFolderOperations.deletePtDataFile(["E:", "folder", "not-pt-folder"], "file.html");
    }
    catch (err) {
        errMsg = (err as Error).message
    }

    expect(errMsg.includes("is not a pt folder")).toBeTruthy();

})

test('Delete pt file/folder does not exist error', async () => {

    const testFolder = createTestFile(errorTestFile, "errorFolder", "errorFile");
    let errMsg = '';

    try {
        await PtFolderOperations.deletePtDataFile(["E:", "ootp_data","pt_folder_test_not"], "file.html");
    }
    catch (err) {
        errMsg = (err as Error).message
    }

    errMsg = '';

    try {
        await PtFolderOperations.deletePtDataFile(testFolder.ptFolderPath, "not-file.html");
    }
    catch (err) {
        errMsg = (err as Error).message
    }

    expect(errMsg.includes("does not exist")).toBeTruthy();

})

function createTestFile (root: string[], ptFolderName: string | null, fileName: string | null) {

    const ptFolderPath = getPtFolderPath(root, ptFolderName)
    const ptDataExportFolderPath = [...ptFolderPath, 'news', 'html', 'temp'];
    const ptDataExportFolder = path.join(...ptDataExportFolderPath);

    if (!fs.existsSync(ptDataExportFolder)) {
        fs.mkdirSync(ptDataExportFolder, {recursive: true});
    }

    const ptDataExportFilePath = [...ptDataExportFolderPath, (fileName ? fileName : getRandomName()) + ".html"]
    fs.writeFileSync(path.join(...ptDataExportFilePath), '');

    return {
        ptDataExportFolderPath,
        ptFolderPath,
        ptDataExportFilePath,
    };

}

function getPtFolderPath (root: string[], ptFolderName: string | null) {
    return [...root, "saved_games",`${ptFolderName ? ptFolderName : getRandomName()}.pt`];
}

function getRandomName () {
    return "file"+fileNameCounter++;
}