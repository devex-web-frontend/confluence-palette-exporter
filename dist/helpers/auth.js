'use strict';

var prompt = require('prompt');
var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var absoluteCredentialsPath = path.join(process.cwd(), '/credentials.json');
var relativeCredentialsPath = path.relative(__dirname, absoluteCredentialsPath);

var credentials = fs.existsSync(absoluteCredentialsPath) ? require(relativeCredentialsPath) : {};

module.exports = {
	requestCredentials: getAuthInfo,
	getCreds: function getCreds() {
		return credentials;
	}
};

function createCredentialsFile(data) {
	fs.writeFile(absoluteCredentialsPath, data, function () {
		console.log("The file " + absoluteCredentialsPath.toString() + " was saved!");
	});
}
/**
 * Returns promise for getting user credentials
 * @param {Boolean=} needToSave – whether credentials should be saved into JSON
 * @return {Promise.<{user: String, pass: String}>}
 */
function getAuthInfo() {
	var needToSave = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

	var properties = [{
		description: 'username',
		name: 'user'
	}, {
		description: 'password',
		name: 'pass',
		hidden: true
	}],
	    saveCredentials = {
		description: 'Save to crendinals.json? Y/N',
		name: 'needToSave',
		conform: function conform(res) {
			return res === 'Y' || res === 'N';
		}
	};
	if (needToSave) {
		properties.push(saveCredentials);
	}
	prompt.start();

	return new Promise(function (resolve, reject) {
		if (!credentials || !credentials.pass || !credentials.user) {
			prompt.get(properties, function (err, res) {
				if (err) {
					reject(err);
				} else {
					credentials = { user: res.user, pass: res.pass };
					if (res.needToSave === 'Y') {
						createCredentialsFile(JSON.stringify(credentials));
					}
					resolve(credentials);
				}
			});
		} else {
			resolve(credentials);
		}
	});
}