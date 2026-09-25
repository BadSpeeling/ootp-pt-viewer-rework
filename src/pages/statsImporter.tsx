import * as React from "react";
import { PtDataExportState } from "../backend/types";
import { PtDataStatsFile, DataSaveStatus } from '../userInterfaceTypes'

export function StatsImporter () {

    const [ptDataFiles,setPtDataFiles] = React.useState([] as PtDataStatsFile[]);

    React.useEffect(() => {

        const getPtDataFiles = async () => {
            const currentPtDataFiles = await window.electronAPI.getExportedPtDataFiles();
            setPtDataFiles(currentPtDataFiles.map(f => {
                return {
                    fileName: f.fileName ?? "",
                    filePath: f.path,
                    description: "",
                    isIncludedFlag: false,
                    onlyMyTeamFlag: false,  
                    dataExportState: f.exportState,
                    dataSaveStatus: DataSaveStatus.None,                    
                }
            }));
        }

        getPtDataFiles();

    }, []);

    const updateTournamentExport = (tourney: PtDataStatsFile,index: number) => {
        setPtDataFiles(ptDataFiles.map((t, i) => {
            return index === i ? tourney : t;
        }));
    }

    const updateDescription = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({
            ...ptDataFiles[index],
            description: e.target.value
        }, index)
    }

    const updateCheckbox = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({
            ...ptDataFiles[index],
            isIncludedFlag: e.target.checked
        }, index)
    }

    const updateMyTeamFlag = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({
            ...ptDataFiles[index],
            onlyMyTeamFlag: e.target.checked
        }, index)
    }

    const tableBody = ptDataFiles.filter(f => f.dataExportState === PtDataExportState.READY_TO_READ).map((f, index) => {
        return (
            <tr className="table-header" key={f.fileName}>
                <td className="p-2 text-center"><input type='checkbox' checked={f.onlyMyTeamFlag} onChange={(e) => updateMyTeamFlag(e, index)}/></td>
                <td className="p-2 text-center"><input type='checkbox' checked={f.isIncludedFlag} onChange={(e) => updateCheckbox(e, index)}/></td>
                <td className="p-2 text-center">{f.fileName}</td>
                <td className="p-2 text-center"><input className="border-gray border-1 rounded-md px-2 py-1" onChange={(e) => updateDescription(e,index)} value={f.description}/></td>
                {/* <td className="p-2 text-center">{tournamentRowStatusIcon(f.dataSaveStatus)}</td> */}
            </tr>
        )
    })

    return (
        <table>
            <tr className="table-header">
                <th className="p-2 text-center">Only My Team?</th>
                <th className="p-2 text-center">Include?</th>
                <th className="p-2 text-center">File</th>
                <th className="p-2 text-center">Description</th>
                <th className="p-2 text-center">Status</th>
            </tr>
            {tableBody}
        </table>
    )

}