import * as fs from "fs";

if (!process.env.NODE_ENV) {
    let filePath = process.env.ENV_PATH || '../.env';
    if (fs.existsSync(filePath)) {
        require('dotenv').config({
            path: filePath
        });
    }
}

export class SiteConfig {
    public static CachePort: number = process.env.CACHE_PORT || 6379;
    public static CacheHost: string = process.env.CACHE_HOST || '127.0.0.1';
    public static SitePort: number = process.env.PORT || 3000;
    public static ScanPaths: string = process.env.SCAN_PATHS || './controllers,./services';
}