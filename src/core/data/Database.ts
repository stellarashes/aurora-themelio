import {Sequelize, ModelAttributes} from "sequelize";
import {SiteConfig} from "../../SiteConfig";
import {DataModel} from "./DataModel";
import {ModelRelation} from "./ModelRelation";
import {TransactionOptions, Transaction} from "sequelize";

export class Database {
    private static instance: Sequelize;
    private static relations: ModelRelation[] = [];

    public static initialize() {
        if (!this.instance) {
            this.instance = new Sequelize(SiteConfig.DatabaseSchema, SiteConfig.DatabaseUser, SiteConfig.DatabasePass, {
                host: SiteConfig.DatabaseHost,
                port: SiteConfig.DatabasePort,
                dialect: SiteConfig.DatabaseDialect,
                logging: SiteConfig.DatabaseLog,
            });
        }
    }

    public static defineType(model: typeof DataModel, options: any, columnOptions: ModelAttributes) {
        if (!this.instance) {
            this.initialize();
        }
        options['sequelize'] = this.instance;
        this.instance.define(model.name, columnOptions, options);
        model.init(columnOptions, options);
    }

    public static addRelation(relation: ModelRelation) {
        this.relations.push(relation);
    }

    public static getTransaction(options?: TransactionOptions): Promise<any> {
        return this.instance.transaction(options);
    }

    public static linkAllRelations() {
        for (let relation of this.relations) {
            relation.source[relation.type].call(relation.source, relation.target, relation.params);
        }
    }

    public static async sync() {
        if (SiteConfig.DatabaseSync) {
            return this.instance.sync();
        } else {
            return Promise.resolve();
        }
    }
}

