import * as rr from "recursive-readdir";

export class ControllerInitializer {
    public async initialize() {
        return new Promise<void>((resolve, reject) => {
            rr(process.env.CONTROLLER_PATH || './controllers', ['!*.js'], (err, files) => {
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