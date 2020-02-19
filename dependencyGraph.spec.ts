import { should } from 'chai';
import { GraphGenerator } from './graphGenerator';
const fs = require('fs-extra');

should();

describe('Dependency Graph', function () {

    it('Should output graph for mocha package', async function() {
        let expectedResult = await fs.readJson('./tests/mochaGraph.json');
        let graph = await new GraphGenerator('mocha').generateGraph();
        graph.should.deep.equal(expectedResult);
    }).timeout(10000);

    it('Should output graph for express package, version 4.16.4', async function() {
        let expectedResult = await fs.readJson('./tests/expressGraph.json');
        let graph = await new GraphGenerator('express', '4.16.4').generateGraph();
        graph.should.deep.equal(expectedResult);
    }).timeout(10000);

});