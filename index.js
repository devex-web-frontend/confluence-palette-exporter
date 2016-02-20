var read = require('./dist/getColors.js');
var write = require('./dist/publishHTML.js');
var auth = require('./dist/helpers/auth.js');
var saveCreds = false;

module.exports = {
	readToFile: readToFile,
	readToMultipleFiles: readToMultipleFiles,
	write: writetoFile,
	saveCreds: function(state) {
		saveCreds = state
	}
};

function credentialsError() {
	console.log('credentials getting error')
}

function readToFile() {
	var args = arguments;
	return auth.requestCredentials(saveCreds).then(function() {
		read.readToFile(args[0], args[1]);
	}, credentialsError);
}

function readToMultipleFiles() {
	var args = arguments;
	return auth.requestCredentials(saveCreds).then(function() {
		read.readToMultipleFiles(args[0]);
	}, credentialsError)
}

function writetoFile() {
	var args = arguments;
	return auth.requestCredentials(saveCreds).then(function() {
		write.write(args[0], args[1]);
	}, credentialsError)
}

