let prompt = require('prompt');
let fs = require('fs');
let path = require('path');
let Promise = require('promise');

let absoluteCredentialsPath = path.join(process.cwd(), '/credentials.json');
let relativeCredentialsPath = path.relative(__dirname, absoluteCredentialsPath);

let credentials = fs.existsSync(absoluteCredentialsPath) ? require(relativeCredentialsPath) : {};

module.exports = {
	requestCredentials: getAuthInfo,
	getCreds: () => credentials
};

function createCredentialsFile(data) {
	fs.writeFile(absoluteCredentialsPath, data, function() {
		console.log("The file " + absoluteCredentialsPath.toString() + " was saved!");
	});
}
/**
 * Returns promise for getting user credentials
 * @param {Boolean=} needToSave – whether credentials should be saved into JSON
 * @return {Promise.<{user: String, pass: String}>}
 */
function getAuthInfo(needToSave = false) {
	let properties = [{
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
			conform: function(res) {
				return res === 'Y' || res === 'N';
			}
		};
	if (needToSave) {
		properties.push(saveCredentials);
	}
	prompt.start();

	return new Promise((resolve, reject) => {
		if (!credentials || !credentials.pass || !credentials.user) {
			prompt.get(properties, (err, res) => {
				if (err) {
					reject(err);
				} else {
					credentials = {user: res.user, pass: res.pass};
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
