import {SiteConfig} from "../SiteConfig";
import * as fs from "fs";
import * as glob from "glob";

export class ClassScanner {
    public static async initialize(): Promise<any> {
        let scanPathsString = SiteConfig.ScanPaths;
        let scanPaths = scanPathsString.split(',');
        return Promise.all(
            scanPaths.map(this.scanForPath)
        );
    }

    private static async scanForPath(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let cwd = process.cwd();
            fs.stat(path, (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve();
                    } else {
                        reject(err);
                    }
                }
                else if (stats.isDirectory()) {
                    glob(path, null, (err, files) => {
                        if (err) {
                            reject(err);
                        }

                        for (let file of files) {
                            require(cwd + '/' + file);
                        }

                        resolve();
                    });
                }
            });
        });
    }
}