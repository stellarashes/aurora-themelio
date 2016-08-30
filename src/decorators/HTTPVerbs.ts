

function http(verb:string) {
    return function (target:any, key:string, value:any) {
        return {
            value: function (...args:any[]) {
                console.log(target, key, value);
            }
        };
    }
}

export let GET:Function = http('GET');
export let POST:Function = http('POST');
export let PUT:Function = http('PUT');
export let UPDATE:Function = http('UPDATE');
export let DELETE:Function = http('DELETE');
