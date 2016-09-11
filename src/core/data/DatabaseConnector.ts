import {Sequelize, ModelAttributes} from "sequelize";
import {SiteConfig} from "../../SiteConfig";
import {DataModel} from "./DataModel";


export class DatabaseConnector {
    private static instance: Sequelize;

    public static async initialize() {
        this.instance = new Sequelize(SiteConfig.DatabaseSchema, SiteConfig.DatabaseUser, SiteConfig.DatabasePass, {
            host: SiteConfig.DatabaseHost,
            port: SiteConfig.DatabasePort,
            dialect: SiteConfig.DatabaseDialect,
            logging: SiteConfig.DatabaseLog,
        });

        return Promise.resolve();
    }

    public static defineType(model: typeof DataModel, options: any, columnOptions: ModelAttributes) {
        options['sequelize'] = this.instance;
        this.instance.define(model.name, columnOptions, options);
        model.init(columnOptions, options);
    }

    public static async sync() {
        if (SiteConfig.DatabaseSync) {
            return this.instance.sync();
        } else {
            return Promise.resolve();
        }
    }
}

