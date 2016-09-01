import {AutoWired, Inject} from "typescript-ioc";
import {CBOAuthService} from "./CBOAuthService";
@AutoWired
export class JobSearchService {
    @Inject private oauth: CBOAuthService;

    public async search(parameters: any) {
        parameters.SiteEntity = 'talentnetworkjob';
        parameters.UseFacets = 'true';
        parameters.ShowCountryCode = 'true';
        parameters.searchAllCountries = parameters.countryFacet ? 'false' : 'true';

        return this.oauth.get('/consumer/jobs/search', {
            qs: parameters,
            headers: {
                Version: 'v3'
            }
        });
    }
}