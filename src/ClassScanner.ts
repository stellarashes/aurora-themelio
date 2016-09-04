import * as rr from "recursive-readdir";

export class ClassScanner {
    public async initialize() {
        let scanPathsString = process.env.SCAN_PATHS || './controllers,./services';
        let scanPaths = scanPathsString.split(',');
        return Promise.all(
            scanPaths.map(this.scanForPath)
        );
    }

    private async scanForPath(path: string) {
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