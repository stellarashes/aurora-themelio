export abstract class CacheService {
    abstract async get(key: string): Promise<any>;
    abstract async set(key: string, value: any): Promise<any>;
    abstract async expire(key: string, seconds: number): Promise<any>;
    abstract async exists(key: string): Promise<any>;
}