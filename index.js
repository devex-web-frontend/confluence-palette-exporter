var readModule = require('./dist/getColors.js');
var writeModule = require('./dist/publishHTML.js');
var authMudule = require('./dist/helpers/auth.js');

module.exports = {
	readToFile: readModule.readToFile,
	readToMultipleFiles: readModule.readToMultipleFiles,
	write: writeModule.write,
	auth: auth
};

function auth(saveCreds) {
	return authMudule.requestCredentials(saveCreds);
}
