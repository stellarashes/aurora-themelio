import {DataTypes, ModelAttributeColumnOptions} from "sequelize";

export class SiteConfig {
    public static CachePort: number = process.env.CACHE_PORT || 6379;
    public static CacheHost: string = process.env.CACHE_HOST || 'localhost';
    public static SitePort: number = process.env.PORT || 3000;
    public static ScanPaths: string = process.env.SCAN_PATHS || 'controllers/**/*.js,services/**/*.js,models/**/*.js';

    public static DatabaseUser: string = process.env.DB_USER || 'demo';
    public static DatabasePass: string = process.env.DB_PASS || '';
    public static DatabaseHost: string = process.env.DB_HOST || 'localhost';
    public static DatabaseSchema: string = process.env.DB_SCHEMA || 'demo';
    public static DatabasePort: number = process.env.DB_PORT || 3306;
    public static DatabaseDialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql' = 'mysql';
    public static DatabaseSync: boolean = typeof(process.env.DB_SYNC) !== 'undefined' ? process.env.DB_SYNC : process.env.NODE_ENV === 'development';
    public static DatabaseLog: Function = process.env.NODE_ENV === 'development' ? console.log : null;

    public static DatabaseModelDefaultPK: boolean = true;
    public static DatabaseDefaultPKName: string = 'id';
    public static DatabaseDefaultPKOptions: string | DataTypes.DataType | ModelAttributeColumnOptions = {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    };
}