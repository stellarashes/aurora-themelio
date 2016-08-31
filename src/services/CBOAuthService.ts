let tnAPI = require('tn-api');
let CacheService = require('TSEMemberServices').CacheService;

tnAPI.setCache(new CacheService());

export class CBOAuthService {
    public async request(method: string, path: string, options: any = {}) {
        if (!options) {
            options = {};
        }

        if (!method) {
            method = 'get';
        }

        return new Promise<any>((resolve, reject) => {
            options.url = CBOAuthService.getBasePath() + (process.env.BASE_API_PATH || '') + path;
            tnAPI.request[method.toLowerCase()].call(tnAPI.request, options, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public async get(path: string, options: any = {}) {
        return this.request('get', path, options);
    }

    public async post(path: string, options: any = {}) {
        return this.request('post', path, options);
    }

    public async put(path: string, options: any = {}) {
        return this.request('put', path, options);
    }

    private static getBasePath(): string {
        if (process.env.NODE_ENV === 'development') {
            return 'https://wwwtest.api.careerbuilder.com';
        } else {
            return 'https://api.careerbuilder.com';
        }
    }
}