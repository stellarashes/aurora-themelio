import {Container} from "typescript-ioc";
import {CacheService} from "../services/cache/CacheService";
import {RedisCacheService} from "../services/cache/RedisCacheService";

export class DefaultServiceScanner {
    public static async scan() {
        this.scanFor(CacheService, RedisCacheService);
    }

    private static scanFor(source: Function, defaultService: Function) {
        let service = Container.get(source);
        if (service.constructor.name === source.name) {
            console.log("Trying to use default implementation for " + source.name);
            Container.bind(defaultService).to(source);
        }
    }
}