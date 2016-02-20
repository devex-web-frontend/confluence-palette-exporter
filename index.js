var read = require('./dist/getColors.js');
var write = require('./dist/publishHTML.js');
var auth = require('./dist/helpers/auth.js');

module.exports = {
	readToFile: readToFile,
	readToMultipleFiles: readToMultipleFiles,
	write: writetoFile
};
function credinalsError() {
	console.log('credinals getting error')
}

function readToFile() {
	var args = arguments;
	return auth.requestCredinals().then(function() {
		read.readToFile(args[0], args[1]);
	}, credinalsError);
}

function readToMultipleFiles() {
	var args = arguments;
	return auth.requestCredinals().then(function() {
		read.readToMultipleFiles(args[0]);
	},credinalsError)
}

function writetoFile() {
	var args = arguments;
	return auth.requestCredinals().then(function() {
		write.write(args[0], args[1]);
	},credinalsError)
}

