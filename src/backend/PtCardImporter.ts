import { ImportCardResult } from "../userInterfaceTypes";
import { IOotpExportReader } from "./export-reader";
import { OotpDataExport, PtCardListExportScriptGenerator } from "./export-stats";
import { Database } from "./database/Database";

export class PtCardImporter {

    private database: Database;
    private cards: Promise<OotpDataExport>;

    constructor (database: Database, exportReader: IOotpExportReader) {
        this.database = database;
        this.cards = exportReader.readExport();
    }

    importPtCardsAsync = async () => {

        const scriptGenerator: PtCardListExportScriptGenerator = new PtCardListExportScriptGenerator(await this.cards);
        const liveUpdateOccuredFlag = await this.didLiveUpdateOccurFlagAsync(scriptGenerator);

        if (!liveUpdateOccuredFlag) {
            const ptCardListExportScript = scriptGenerator.getImportScript();
            await this.database.openConnection();
            await this.database.execute(ptCardListExportScript);
            await this.database.closeConnection();
            return ImportCardResult.SUCCESS;
        }
        else {
            return ImportCardResult.LIVE_UPDATE_NEEDED;
        }

    }

    private didLiveUpdateOccurFlagAsync = async (generator: PtCardListExportScriptGenerator) => {

        const script  = generator.getCheckLiveUpdateScript();
        await this.database.openConnection();
        const cardsLiveUpdateResult = await this.database.getAllMapped<{LiveUpdateOccured: boolean, CardID: number}>(script);
        await this.database.closeConnection();
        return cardsLiveUpdateResult.filter(card => card.LiveUpdateOccured).length > 0;

    }

}