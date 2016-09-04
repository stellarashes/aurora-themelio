export abstract class CacheService {
    abstract async get(key: string);
    abstract async set(key: string, value: any);
    abstract async expire(key: string, seconds: number);
    abstract async exists(key: string);
}