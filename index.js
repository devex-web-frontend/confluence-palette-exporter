var read = require('./dist/getColors.js');
var write = require('./dist/publishHTML.js');

module.exports = {
	readToFile: read.readToFile,
	readToMultipleFiles: read.readToMultipleFiles,
	write: write.write
};