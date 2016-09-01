import {GET} from "../decorators/HTTPVerbs";
import {Path} from "../decorators/Path";
import {Inject, AutoWired} from "typescript-ioc";
import {MemberDataService} from "../services/MemberDataService";
import {JobSearchService} from "../services/JobSearchService";

@AutoWired
@Path('/member/recs')
export class JobRecsIdealController {
    @Inject private memberService: MemberDataService;
    @Inject private jobSearchService: JobSearchService;

    @Path('/:memberDID') @GET
    public async recommendationsByMember(memberDID: string) {
        let memberClassification = await this.memberService.getMemberClassifications(memberDID);
        if (memberClassification.data.length) {
            let onet = memberClassification.data[0].onet;

            let memberLocation = await this.memberService.getMemberInfo(memberDID);
            let location = memberLocation.data.location;
            let lat = location.lat;
            let lon = location.lon;

            return this.jobSearchService.search({
                Location: lat + '::' + lon,
                Onet17Code: onet
            });
        }


    }

    @Path('/info/:memberDID') @GET
    public async testInfo(memberDID: string, tnDID: string) {
        let data = await this.memberService.getMemberInfo(memberDID);
        data.testData = tnDID;
        return new Promise<any>(resolve => { resolve(data); });
    }
}
