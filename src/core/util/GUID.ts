let lib = require('node-uuid');

export class GUID {
    public static getGUID(): string {
        return lib.v4();
    }
}