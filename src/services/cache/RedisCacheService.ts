import {CacheService} from "./CacheService";
import {Provides, Singleton} from "typescript-ioc";
import * as redis from "redis";
import {RedisClient} from "redis";
import {SiteConfig} from "../../SiteConfig";

@Singleton
@Provides(CacheService)
export class RedisCacheService extends CacheService {
    private client: RedisClient = null;

    constructor() {
        super();
    }

    async exists(key: string): Promise<any> {
        return this.wrap(this.client.exists, [key]);
    }

    async get(key: string) {
        return this.wrap(this.client.get, [key]);
    }

    async set(key: string, value: any) {
        return this.wrap(this.client.set, [key, value]);
    }

    async expire(key: string, seconds: number) {
        return this.wrap(this.client.expire, [key, seconds]);
    }

    private wrap(method: Function, args: any[]): Promise<any> {
        this.init();
        return new Promise<any>((resolve, reject) => {
            let callback = (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            };

            args.push(callback);
            method.apply(this.client, args);
        });
    }

    private init() {
        if (this.client === null) {
            this.client = redis.createClient({
                host: SiteConfig.CacheHost,
                port: SiteConfig.CachePort
            });
        }
    }

}