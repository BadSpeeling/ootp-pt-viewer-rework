import * as fs from 'node:fs';
import * as path from 'node:path';

export class PtFolderOperations {

    static async deletePtDataFile (ptFolderPath: string[], ptDataFile: string) {

        const ptFolderName = ptFolderPath[ptFolderPath.length-1];

        if (!ptFolderName.includes('.pt')) {
            throw Error (path.join(...ptFolderPath) + " is not a pt folder");
        }

        if (!fs.existsSync(path.join(...ptFolderPath))) {
            throw Error (path.join(...ptFolderPath) + " does not exist");
        }

        const ptDataFilePath = [...ptFolderPath, 'news', 'html', 'temp', ptDataFile];

        if (!fs.existsSync(path.join(...ptDataFilePath))) {
            throw Error (path.join(...ptDataFilePath) + " does not exist");
        }

        await new Promise ((resolve,reject) => {
            fs.rm(path.join(...ptDataFilePath), { force: true }, () => { resolve(true) })
        });

    }

}