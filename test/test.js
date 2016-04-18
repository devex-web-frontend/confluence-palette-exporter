var confluence = require('../index.js');
var colors = require('colors');

var pagesToRead = [{
	name: 'darkScheme',
	id: 103777451
}, {
	id: 104825455,
	useHex: true
}];

var config = [{
	pages: [103777451, 103777451],
	destination: 'test/out/dark.js'
}, {
	pages: pagesToRead,
	destination: './test/out//light.js'
}];

var pagesToWrite = {
	NumericStepper: 108139548
};

function done(result) {
	if (!Array.isArray(result)) {
		result = [result];
	}
	result.forEach(res => {console.log(res.green)});
}
function errorHandler(err) {
	console.log(err.red);
}

confluence.auth(true)

	.then(function() {
		return confluence.readToFile([103777451], '/test/out/test.styl').then(done);
	})
	.then(function() {

		return confluence.readToFile([103777451], '/test/out/test.js').then(done);
	})
	.then(function() {
		return confluence.readToMultipleFiles(config).then(done);
	})
	.then(function() {
		return confluence.write(pagesToWrite, 'test/out/api').then(done);
	})
	.catch(errorHandler);




