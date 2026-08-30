import { OotpExportDataColumn, OotpExportDataColumnType } from "../../src/backend/types";

export class OotpDataExportFakeHelper {

    ootpDataColumns: OotpExportDataColumn[]

    constructor (ootpDataColumns: OotpExportDataColumn[]) {
        this.ootpDataColumns = ootpDataColumns;
    }

    buildRow(record: Map<string, string|number>) {

        const result: string[] = [];

        for (const ootpDataColumn of this.ootpDataColumns) {

            const value = record.get(ootpDataColumn.databaseColumnName)?.toString() ?? null;
            result.push(this.valueHelper(value, ootpDataColumn.type));

        }

        return result;

    }

    private valueHelper (recordValue: string | null, fieldType: OotpExportDataColumnType) {

        const isValueNullFlag = recordValue === null || recordValue === '';

        if (isValueNullFlag) {
            return '';
        }
        else {
            switch (fieldType) {                
                case "INTEGER":                
                case "REAL":
                    return recordValue;
                case "TEXT":
                    return `${recordValue.replaceAll("'","''")}`;
                case "DATETIME":
                    return `${recordValue}`;
                default:
                    return 'UNKNOWN';
            }            
        }

    }

}