import * as rr from "recursive-readdir";
import {SiteConfig} from "../SiteConfig";
import * as fs from "fs";

export class ClassScanner {
    public static async initialize() {
        let scanPathsString = SiteConfig.ScanPaths;
        let scanPaths = scanPathsString.split(',');
        return Promise.all(
            scanPaths.map(this.scanForPath)
        );
    }

    private static async scanForPath(path: string) {
        return new Promise<void>((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    reject(err);
                }
                else if (stats.isDirectory()) {
                    rr(path, ['!*.js'], (err, files) => {
                        if (err) {
                            reject(err);
                        }

                        for (let file of files) {
                            require('./' + file);
                        }

                        resolve();
                    });
                }
            });
        });
    }
}