import { GraphGenerator } from "./graphGenerator";

async function run() {
    try {
        const args = require('minimist')(process.argv.slice(2));
        let packageName = args['p'] || args['packageName'];
        let version = args['v'] || args['version'];
        if (!packageName) {
            console.error('Missing package name field. Please use -p | --packageName <package name>');
        }
    
        let graph = await new GraphGenerator(packageName, version).generateGraph();
        console.log(JSON.stringify(graph, null ,3));
    }
    catch (e) {
        console.error(e);
    }
}

run();