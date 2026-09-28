import * as React from "react";
import { PtDataFolder } from '../../userInterfaceTypes'

type PtDataFoldersProps = {
    ptDataFolders: PtDataFolder[],
} 

export function PtDataFolders ({ptDataFolders}: PtDataFoldersProps) {
    
    const tableBody = ptDataFolders.map((f, index) => {
        return (
            <tr className="table-header" key={index}>
                <td className="p-2 text-center">{f.ptFolderPath}</td>
                <td className="p-2 text-center"><button>Delete all files</button><button>Leave one file</button></td>
            </tr>
        )
    })

    return (
        <div>
            <div>Tournament Folders with multiple files</div>
            <table>
                <thead>
                    <tr className="table-header">
                        <th className="p-2 text-center">PT Folder</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </div>
    )
}