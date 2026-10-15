import * as fs from 'node:fs';
import * as path from 'node:path';

export class PtFolderOperations {

    static async deletePtDataFileAsync (ptDataFilePath: string[]) {

        if (!fs.existsSync(path.join(...ptDataFilePath))) {
            throw Error (path.join(...ptDataFilePath) + " does not exist");
        }

        await this.deleteFile(ptDataFilePath);

    }

    private static deleteFile (filePath: string[]) {

        return new Promise ((resolve,reject) => {
            fs.rm(path.join(...filePath), { force: true }, () => { resolve(true) })
        });

    }

    static async deleteAllPtDataFilesAsync (ptDataFolderPath: string[]) {

        if (!fs.existsSync(path.join(...ptDataFolderPath))) {
            throw Error (path.join(...ptDataFolderPath) + " does not exist");
        }

        const ptDataFiles = await this.findAllPtDataFiles(ptDataFolderPath);
        const ptDataFileDeleteActions = ptDataFiles.map(ptDataFile => {
            return this.deleteFile([...ptDataFolderPath, ptDataFile]);
        })

        await Promise.all(ptDataFileDeleteActions);

    }

    private static async findAllPtDataFiles (ptDataFolderPath: string[]): Promise<string[]> {

        return new Promise ((resolve, reject) => {

            const ptDataFiles: string[] = [];

            fs.readdir(path.join(...ptDataFolderPath), (err, foundPtDataFiles) => {
                foundPtDataFiles.forEach((ptDataFile) => {
                    
                    if (ptDataFile.includes(".html")) {
                        ptDataFiles.push(ptDataFile);
                    }                
                    
                })

                resolve(ptDataFiles);

            })

        })

    }

}