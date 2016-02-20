var confluence = require('../index.js');

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

function done() {
	console.log('converting process finished');
}
function errorHandler(err) {
	console.log('Converting process failed:', err);
}

confluence.readToFile([103777451], '/test/out/test.styl')
	.then(function() {
		return confluence.readToFile([103777451], '/test/out/test.js').then(done)
	})
	.then(function() {
		return confluence.readToMultipleFiles(config)
	})
	.then(function() {
		return confluence.write(pagesToWrite, 'test/out/api').then(done)
	})
	.catch(errorHandler);



