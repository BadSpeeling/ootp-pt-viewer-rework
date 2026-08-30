import { IOotpExportReader } from "../../../src/backend/export-reader";
import { OotpDataExport } from "../../../src/backend/export-stats";
import { OotpExportDataColumn } from "../../../src/backend/types";
import { OotpDataExportFakeHelper } from '../OotpDataExportFakeHelper'

export class FakeOnlyNonLiveUpdateReader implements IOotpExportReader{

    ootpExport: OotpDataExport;

    constructor (ootpDataColumns: OotpExportDataColumn[]) {

        this.ootpExport = new OotpDataExport (ootpDataColumns);

        const cardLive = new Map<string,string|number>([
            ["CardID",1],
            ["CardValue",100],
            ["CardType",1],
        ]); 

        const cardNonLiveImported = new Map<string,string|number>([
            ["CardID",2],
            ["CardValue",100],
            ["CardType",2],
        ]);

        const cardNonLiveNotImported = new Map<string,string|number>([
            ["CardID",3],
            ["CardValue",85],
            ["CardType",2],
        ]);

        const fakeDataHelper = new OotpDataExportFakeHelper(ootpDataColumns);

        this.ootpExport.addStatsRow(fakeDataHelper.buildRow(cardLive));
        this.ootpExport.addStatsRow(fakeDataHelper.buildRow(cardNonLiveImported))
        this.ootpExport.addStatsRow(fakeDataHelper.buildRow(cardNonLiveNotImported))

    }

    readExport () {
        return Promise.resolve(this.ootpExport);
    };

    getRowCount () {
        return this.ootpExport.recordCount();
    }

}