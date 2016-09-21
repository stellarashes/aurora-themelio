import {SiteConfig} from "../SiteConfig";
import * as glob from "glob";
import * as path from "path";

export class ClassScanner {
    public static async initialize(): Promise<any> {
        let scanPathsString = SiteConfig.ScanPaths;
        let scanPaths = scanPathsString.split(',');
        return Promise.all(
            scanPaths.map(this.scanForPath)
        );
    }

    private static async scanForPath(targetPath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let cwd = process.cwd();

            glob(targetPath, null, (err, files) => {
                if (err) {
                    reject(err);
                }

                for (let file of files) {
                    var fullPath = path.resolve(cwd, file);
                    require(fullPath);
                }

                resolve();
            });
        });
    }
}