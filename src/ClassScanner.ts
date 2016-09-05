import * as rr from "recursive-readdir";
import {SiteConfig} from "./SiteConfig";

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
            rr(path, ['!*.js'], (err, files) => {
                if (err) {
                    reject(err);
                }

                for (let file of files) {
                    require('./' + file);
                }

                resolve();
            });
        });
    }
}