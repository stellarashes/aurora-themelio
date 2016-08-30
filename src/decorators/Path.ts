let basePaths = {};
let handlerPaths = {};
let pathToHandlers = {};

export function Path(path: string) {
    path = padPath(path);
    return function(target: any, key?: string, value?: any): any {
        if (target instanceof Function) {
            if (!handlerPaths.hasOwnProperty(target)) {
                handlerPaths[target] = {};
            }

            handlerPaths[target][key] = path;
        } else {
            basePaths[target] = path;


        }
    }
}

function finishMapping() {
    let controllers = _.merge(_.keys(basePaths), _.keys(pathToHandlers));

    for (let controller of controllers) {

    }
}

function padPath(path:string): string {
    if (path.charAt(0) !== '/') {
        return '/' + path;
    }
    return path;
}