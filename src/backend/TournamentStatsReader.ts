import { Database } from "./database/Database"

import { OotpExportDataColumn } from "./types"
import { BattingExportScriptGenerator, OotpDataExport, PitchingExportScriptGenerator, splitOotpStatsExport } from './export-stats';
import { OotpHtmlExportReader } from './export-reader';
import { ProjectJsonModelReader } from './database-creator';
import { CreateStatsBatchCommand, StatsBatchRepository } from "./database/repositories";

export class TournamentStatsReader {

    static async getStats (statsFile: string[]) {

        const exportedStatsModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("exportedStatsColumns.json")
        const exportedStatsModel = await exportedStatsModelReader.getJsonModels();
        const ptCardListReader = new OotpHtmlExportReader(exportedStatsModel, statsFile);
        const exportedStats = await ptCardListReader.readExport();

        const exportedCategorizedStats = splitOotpStatsExport(exportedStatsModel, exportedStats)

        return exportedCategorizedStats;

    }

    static async writeStats (stats: {
        battingSplit: OotpDataExport;
        pitchingSplit: OotpDataExport;
        fieldingSplit: OotpDataExport | undefined;
    }, database: Database, createStatsBatchCommand: CreateStatsBatchCommand) {

        const statsBatchRepo = new StatsBatchRepository(database);
        const statsBatch = await statsBatchRepo.createStatsBatch(createStatsBatchCommand);

        const battingWriteScript =  new BattingExportScriptGenerator(stats.battingSplit, statsBatch.StatsBatchID).getExportWriteScript();
        await database.execute(battingWriteScript);

        const pitchingWriteScript =  new PitchingExportScriptGenerator(stats.pitchingSplit, statsBatch.StatsBatchID).getExportWriteScript();
        await database.execute(pitchingWriteScript);

        if (stats.fieldingSplit) console.log('Do the fielding write');

    }

}