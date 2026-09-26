import * as React from "react";
import { PtDataExportState } from "../backend/types";
import { PtDataFolder, PtDataFile, TournamentFolderImportStatus } from '../userInterfaceTypes'

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
            <PtDataFile ptDataFiles={ptDataFiles} setPtDataFiles={setPtDataFiles}/> 
        </div>
    )

}

type PtDataFileProps = {
    ptDataFiles: PtDataFile[],
    setPtDataFiles: React.Dispatch<React.SetStateAction<PtDataFile[]>>,
} 

function PtDataFile ({ptDataFiles, setPtDataFiles}: PtDataFileProps) {

    const updateTournamentExport = (tourney: PtDataFile,index: number) => {
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

    const updateTournamentStartDate = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({
            ...ptDataFiles[index],
            tournamentStartDate: e.target.value
        }, index)
    }

    const handleTournamentImport = async () => {

        setPtDataFiles(ptDataFiles.map(ptDataFile => {
            if (ptDataFile.isIncludedFlag) {
                return {
                    ...ptDataFile,
                    dataSaveStatus: TournamentFolderImportStatus.Pending,
                }
            }
            else {
                return ptDataFile;
            }
        }));

        const updateFinishedPtDataFileImport = (index: number, isSuccessFlag: boolean) => {
            
            setPtDataFiles((ptDataFiles) => {
                const finishedPtDataFile = {
                    ...ptDataFiles[index], 
                    dataSaveStatus: isSuccessFlag ? TournamentFolderImportStatus.Successful : TournamentFolderImportStatus.Failure
                };
                const updatedPtDataFiles = [...ptDataFiles.slice(0, index), finishedPtDataFile, ...ptDataFiles.slice(index+1)];
                return updatedPtDataFiles;
            });

        }

        ptDataFiles.forEach((ptDataFile, ptDataFileIndex) => {
            
            if (ptDataFile.isIncludedFlag) {
            
                new Promise<boolean>((resolve,reject) => {

                    setTimeout(() => {
                        resolve(true)
                    }, Math.ceil((Math.random()*5000) + 500));

                })
                .then(result => {
                    updateFinishedPtDataFileImport(ptDataFileIndex, result);
                })

            }

        });

    }

    const tableBody = ptDataFiles.map((f, index) => {
        return (
            <tr className="table-header" key={index}>
                <td className="p-2 text-center"><input type='checkbox' checked={f.onlyMyTeamFlag} onChange={(e) => updateMyTeamFlag(e, index)}/></td>
                <td className="p-2 text-center"><input type='checkbox' checked={f.isIncludedFlag} onChange={(e) => updateCheckbox(e, index)}/></td>
                <td className="p-2 text-center">{f.fileName}</td>
                <td className="p-2 text-center"><input className="border-gray border-1 rounded-md px-2 py-1" onChange={(e) => updateDescription(e,index)} value={f.description}/></td>
                <td className="p-2 text-center"><input className="border-gray border-1 rounded-md px-2 py-1" onChange={(e) => updateTournamentStartDate(e,index)} value={f.tournamentStartDate}/></td>
                {<td className="p-2 text-center">{getTournamentFolderImportStatus(f.dataSaveStatus)}</td>}
            </tr>
        )
    })

    return (
        <div>
            <div>Tournament Folders Ready for Import</div>
            <table>
                <thead>
                    <tr className="table-header">
                        <th className="p-2 text-center">Only My Team?</th>
                        <th className="p-2 text-center">Include?</th>
                        <th className="p-2 text-center">File</th>
                        <th className="p-2 text-center">Description</th>
                        <th className="p-2 text-center">Start Date</th>
                        <th className="p-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
            <div><button onClick={handleTournamentImport}>Submit</button></div>
        </div>
    )

} 

function getTournamentFolderImportStatus (status: TournamentFolderImportStatus) {

    if (status === TournamentFolderImportStatus.Pending) {
        return <div>?</div>
        // return <div className="loader"></div>
    }
    else if (status === TournamentFolderImportStatus.Successful) {
        return <div>&#x2705;</div>
    }
    else if (status === TournamentFolderImportStatus.Failure) {
        return <div>&#x274C;</div>
    }
    else {
        return <></>
    }

}