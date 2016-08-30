import {AutoWired} from "typescript-ioc";

@AutoWired
export class RouteRegistry {
    private registry: { [key: string]: { [method: string]: RegistryEntry } };

    public addRoute(path, controller, handler, method) {
        var registryEntry = new RegistryEntry();
        registryEntry.controller = controller;
        registryEntry.handler = handler;
        registryEntry.method = method;
        this.registry[path][method] = registryEntry;
    }
}

class RegistryEntry {
    public controller;
    public handler;
    public method;
}