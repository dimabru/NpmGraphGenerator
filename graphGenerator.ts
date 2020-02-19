const axios = require('axios');
const semver = require('semver')

type GraphNode = {
    packageName: string,
    version: string,
    dependencies: GraphNode[]
};

export class GraphGenerator {

    private cachedDependencies: {
        [packageName: string]: {
            [version: string]: {
                dependencyName: string,
                version: string
            }[]
        }
    } = {};

    constructor(private packageName: string, private version: string = 'latest') {
    }

    public async generateGraph(packageName: string = this.packageName, version: string = this.version): Promise<GraphNode> {
        version = this.getVersion(version);
        let dependencies = await this.getDependencies(packageName, version);
        let graphNode: GraphNode = { packageName, version, dependencies: [] };

        let graphs: Promise<GraphNode>[] = [];
        for (let dependency of dependencies) {
            let depNode = this.generateGraph(dependency.dependencyName, dependency.version);
            graphs.push(depNode);
        }
        
        graphNode.dependencies = await Promise.all(graphs);
        return graphNode;
    }

    private async getDependencies(packageName: string, version: string): Promise<{ dependencyName: string, version: string }[]> {
        if (this.cachedDependencies[packageName] && this.cachedDependencies[packageName][version]) {
            return this.cachedDependencies[packageName][version];
        }

        let res = await axios.get(`https://registry.npmjs.com/${packageName}/${version}`);
        let dependencies: { dependencyName: string, version: string }[] = [];

        for (let dependency in res.data.dependencies) {
            dependencies.push({ dependencyName: dependency, version: this.getVersion(res.data.dependencies[dependency]) });
        }

        if (!this.cachedDependencies[packageName]) {
            this.cachedDependencies[packageName] = {
                [version]: dependencies
            }
        }
        else {
            this.cachedDependencies[packageName][version] = dependencies;
        }

        return dependencies;
    }

    private getVersion(version: string): string {
        return version !== 'latest' ? semver.coerce(version).version : version;
    }
}