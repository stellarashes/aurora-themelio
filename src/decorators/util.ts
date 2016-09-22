export function unravelWrappedConstructor(target: any) {
    if (target.hasOwnProperty('__parent')) {
        return unravelWrappedConstructor(target['__parent']);
    }

    return target.prototype;
}