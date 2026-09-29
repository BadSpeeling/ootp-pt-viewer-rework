import * as path from 'node:path';
import * as fs from 'node:fs';

import { PtDataExportState, PtDataExportFile } from './types';

export class PtFolderSearcher {

    static getAllPtFolders (ootpRoot: string[]) : Promise<string[]> {
    
        const root = path.join(...ootpRoot);

        return new Promise ((resolve,reject) => {
    
            const savedGames = path.join(root, 'saved_games')
    
            const ptFolders: string[] = []
    
            fs.readdir(savedGames, (err, files) => {
                files.forEach((file) => {
                    
                    if (file.includes(".pt")) {
                        ptFolders.push(path.join(savedGames,file))
                    }                
                    
                })
    
                resolve(ptFolders)
    
            })
    
        })
    
    }
    
    static locateHtmlFiles (ptFolderPaths: string[]) : Promise<PtDataExportFile[]> {
    
        return Promise.all<PtDataExportFile>(ptFolderPaths.map((ptFolderPath,index) => {
            return new Promise ((resolve,reject) => {
                const htmlStatsFolder = path.join(ptFolderPath, 'news', 'html', 'temp')
    
                fs.readdir(htmlStatsFolder, (err, files) => {
                    
                    if (err) {
                        resolve({
                            exportState: PtDataExportState.ERROR,
                            ptFolder: ptFolderPath,
                            path: htmlStatsFolder,                            
                        })                
                    }
                    else {
                        if (files.length === 1) {
                            resolve({
                                exportState: PtDataExportState.READY_TO_READ,
                                ptFolder: ptFolderPath,
                                path: htmlStatsFolder,
                                fileName: files[0],
                            })
                        }
                        else if (files.length > 1) {
                            resolve({
                                exportState: PtDataExportState.MULTIPLE_OUTPUT_FILES,
                                ptFolder: ptFolderPath,
                                path: htmlStatsFolder,
                            })
                        }
                        else {
                            resolve({
                                exportState: PtDataExportState.NO_OUTPUT_FILES,
                                ptFolder: ptFolderPath,
                                path: htmlStatsFolder,
                            })
                        }
                    }
                })
            })
        }))
    
    }

}