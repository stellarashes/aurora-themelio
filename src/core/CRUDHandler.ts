import {Request, Response, Application} from "express";
import {DataModel} from "./data/DataModel";
import {ArgumentError} from "./exceptions/ArgumentError";
export class CRUDHandler {
    constructor(private req: Request, private model: typeof DataModel) {
    }

    public async handleCRUD(): Promise<any> {
        switch (this.req.method.toLowerCase()) {
            case 'get':
                return this.handleGet();
            case 'post':
                return this.handlePost();
            case 'put':
                return this.handleUpdate();
            case 'delete':
                return this.handleDelete();
        }

        return Promise.resolve(); // do nothing on unsupported methods
    }

    private async handlePost() {
        return this.model.create(this.req.body);
    }

    private async handleUpdate() {
        let instance = await this.handleGet();
        Object.assign(instance, this.req.body);
        return instance.save();
    }

    private async handleGet() {
        return this.model.findOne(this.getWhereFromModel());
    }

    private async handleDelete() {
        let instance = await this.handleGet();
        if (instance) {
            return instance.destroy();
        }
        throw new ArgumentError();
    }

    private getWhereFromModel() {
        let data = Object.assign({}, this.req.query, this.req.params, this.req.body || {});
        let pkVals = this.model.getPKValuesFromObject(data);
        for (let key in pkVals) {
            if (typeof(pkVals[key]) === 'undefined') {
                throw new ArgumentError('PrimaryKeyCriteriaNotFound');
            }
        }

        return pkVals;
    }
}