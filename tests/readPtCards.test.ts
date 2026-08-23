import { test, expect } from '@jest/globals'
import { checkErrorMessage } from './util'
import { OotpExportDataColumn } from '../src/backend/types'
import { IOotpExportReader, OotpCsvExportReader } from '../src/backend/export-reader'

test('Read a card out of the data file', async () => {

    const expectedHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumber",
            nameInSource: "ExampleNumber",
            type: "INTEGER",
        }
    ]

    const dataReader: IOotpExportReader = new OotpCsvExportReader(expectedHeaders, [".","tests","data","simple_pt_card_list.csv"]);
    const exportResults = await dataReader.readExport();
    
    expect(exportResults.recordCount() === 1).toBeTruthy();

    const readCard = exportResults.getRecord(0);
    validateColumnValue(readCard[0], 'Test String');
    validateColumnValue(readCard[1], '125');

})

test('Multiple row test with 1 column being empty', async () => {

    const expectedHeaders: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable",
            type: "INTEGER",
        },
        {
            databaseColumnName: "ExampleColumn",
            nameInSource: "ExampleColumn",
            type: "INTEGER",
        },        
    ]

    const dataReader: IOotpExportReader = new OotpCsvExportReader(expectedHeaders, [".","tests","data","multi_row_pt_card_list.csv"]);
    const exportResults = await dataReader.readExport();

    expect(exportResults.recordCount() === 3).toBeTruthy();

    const ptCardWithEmptyCol = exportResults.getRecord(1);
    validateColumnValue(ptCardWithEmptyCol[1], '');

})

test('Test read errors', async () => {

    const callDataReader = async (columns: OotpExportDataColumn[], expectedError: string) => {
        try {
            const dataReader: IOotpExportReader = new OotpCsvExportReader(columns, [".","tests","data","multi_row_pt_card_list.csv"]);
            await dataReader.readExport();

            return false;
        }
        catch (err) {
            return checkErrorMessage(err, expectedError);
        }
    }

    const incorrectAmountColumns: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable",
            type: "INTEGER",
        },        
    ]

    const incorrectColumnCountErrorOccuredFlag = await callDataReader(incorrectAmountColumns, "The expected input and actual input do not have the same amount of columns");
    expect(incorrectColumnCountErrorOccuredFlag).toBeTruthy();

    const incorrectNameColumns: OotpExportDataColumn[] = [
        {
            databaseColumnName: "ExampleString",
            nameInSource: "ExampleString",
            type: "TEXT",
        },
        {
            databaseColumnName: "ExampleNumberNullable",
            nameInSource: "ExampleNumberNullable_INCORRECT",
            type: "INTEGER",
        },
        {
            databaseColumnName: "ExampleColumn",
            nameInSource: "ExampleColumn",
            type: "INTEGER",
        },        
    ]

    const incorrectColumnNameErrorOccuredFlag = await callDataReader(incorrectNameColumns, "is not the expected column name in place");
    expect(incorrectColumnNameErrorOccuredFlag).toBeTruthy();

})

const validateColumnValue = (entry: string | undefined, value: string) => {
    expect(entry === value).toBeTruthy();
}