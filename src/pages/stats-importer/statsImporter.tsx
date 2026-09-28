import * as React from "react";
import { PtDataExportState } from "../../backend/types";
import { PtDataFolder, PtDataFile, TournamentFolderImportStatus } from '../../userInterfaceTypes'
import { PtDataFiles } from "./ptDataFiles";
import { PtDataFolders } from "./ptDataFolders";

export function StatsImporter () {

    const [ptDataFolders,setPtDataFolders] = React.useState([] as PtDataFolder[]);
    const [ptDataFiles,setPtDataFiles] = React.useState([] as PtDataFile[]);

    React.useEffect(() => {

        const getPtDataFiles = async () => {
            const currentPtDataFiles = await window.electronAPI.getExportedPtDataFiles();
            
            setPtDataFiles(currentPtDataFiles.filter(f => f.exportState === PtDataExportState.READY_TO_READ).map(f => {
                return {
                    fileName: f.fileName ?? "No file name",
                    filePath: f.path,
                    ptFolderPath: f.ptFolder,
                    tournamentStartDate: "",
                    description: "",
                    isIncludedFlag: false,
                    onlyMyTeamFlag: false,  
                    dataSaveStatus: TournamentFolderImportStatus.None,                       
                }
            }));

            setPtDataFolders(currentPtDataFiles.filter(f => f.exportState === PtDataExportState.MULTIPLE_OUTPUT_FILES).map(f => {
                return {
                    ptFolderPath: f.ptFolder,                    
                }
            }));
            
        }

        getPtDataFiles();

    }, []);

    return (
        <div>
            <PtDataFiles ptDataFiles={ptDataFiles} setPtDataFiles={setPtDataFiles}/> 
            <PtDataFolders ptDataFolders={ptDataFolders}/>
        </div>
    )

}