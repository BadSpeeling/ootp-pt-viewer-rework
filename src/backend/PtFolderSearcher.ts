import * as path from 'node:path';
import * as fs from 'node:fs';

import { PtDataExportState, PtDataExportFile } from './types';

export class PtFolderSearcher {

    static getAllPtFolders (ootpRoot: string[]) : Promise<string[][]> {

        const savedGamesPath = [...ootpRoot, 'saved_games'];
        const savedGames = path.join(...ootpRoot, 'saved_games');

        return new Promise ((resolve,reject) => {
    
            const ptFolders: string[][] = [];
    
            fs.readdir(savedGames, (err, curPtFolders) => {
                curPtFolders.forEach((curPtFolder) => {
                    
                    if (curPtFolder.includes(".pt")) {

                        const ptFolderPath = [...savedGamesPath, curPtFolder];
                        ptFolders.push(ptFolderPath);

                    }                
                    
                })
    
                resolve(ptFolders)
    
            })
    
        })
    
    }
    
    static locateHtmlFiles (ptFolderPaths: string[][]) : Promise<PtDataExportFile[]> {
    
        return Promise.all<PtDataExportFile>(ptFolderPaths.map((ptFolderPath,index) => {
            return new Promise ((resolve,reject) => {

                const htmlStatsFolderPath = [...ptFolderPath, 'news', 'html', 'temp'];
                const htmlStatsFolder = path.join(...htmlStatsFolderPath);
    
                fs.readdir(htmlStatsFolder, (err, files) => {
                    
                    if (err) {
                        resolve({
                            exportState: PtDataExportState.ERROR,
                            ptFolderPath: ptFolderPath,
                            filePath: htmlStatsFolderPath,
                            ptDataFolderPath: htmlStatsFolderPath,                            
                        })                
                    }
                    else {
                        if (files.length === 1) {
                            resolve({
                                exportState: PtDataExportState.READY_TO_READ,
                                ptFolderPath: ptFolderPath,
                                filePath: htmlStatsFolderPath,
                                fileName: files[0],
                                ptDataFolderPath: htmlStatsFolderPath,                            
                            })
                        }
                        else if (files.length > 1) {
                            resolve({
                                exportState: PtDataExportState.MULTIPLE_OUTPUT_FILES,
                                ptFolderPath: ptFolderPath,
                                filePath: htmlStatsFolderPath,
                                ptDataFolderPath: htmlStatsFolderPath,
                            })
                        }
                        else {
                            resolve({
                                exportState: PtDataExportState.NO_OUTPUT_FILES,
                                ptFolderPath: ptFolderPath,
                                filePath: htmlStatsFolderPath,
                                ptDataFolderPath: htmlStatsFolderPath,
                            })
                        }
                    }
                })
            })
        }))
    
    }

}