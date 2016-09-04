let lib = require('guid');

export class GUID {
    public static getGUID(): string {
        let guid = lib.create();
        return guid.value;
    }
}