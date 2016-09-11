import {Container} from "typescript-ioc";
import {CacheService} from "../services/cache/CacheService";

export class DefaultServiceScanner {
    public static async scan() {
        this.scanFor(CacheService, '../services/cache/RedisCacheService');
    }

    private static scanFor(source: Function, defaultServicePath: string) {
        let service = Container.get(source);
        if (service.constructor.name === source.name) {
            console.log("Trying to use default implementation for " + source.name);
            require(__dirname + '/' + defaultServicePath);
        }
    }
}