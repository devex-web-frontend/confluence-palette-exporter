let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');
let Promise = require('promise');
let parser = require('./colorsTableParser.js');
let objectAssign = require('object-assign');
let toSource = require('tosource');

module.exports = {
	write: generateFile
};
/**
 * Sanitizes file path to start with /
 * @param {String} path
 * @return {String}
 */
function sanitizePath(path) {
	if (path.charAt(0) !== '/') {
		path = '/' + path;
	}
	return path;
}
/**
 * Creates folders for filePath and returns relative to process path to file
 * @param {String} relativePath – path to file
 * @return {String}
 */
function createFolders(relativePath) {

	let folders = sanitizePath(relativePath).split('/').slice(1),
		fileName = folders.pop(),
		folderPath = process.cwd();

	folders.forEach(folderName => {
		folderPath = path.join(folderPath, folderName);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}
	});

	return path.join(folderPath, fileName);
}
/**
 * Returns promise for writing to file
 * @param {String} text – text to write
 * @param {String} relativePath – path to file
 * @return {Promise.<String>}
 */
function writeToFile(text, relativePath) {

	let absolutePath = createFolders(relativePath);

	return new Promise((resolve, reject) => {
		fs.writeFile(absolutePath, text, err => {
			if (err) {
				reject(err);
			}
			resolve(`The file ${relativePath} was saved!`);
		});
	});
}
/**
 * Returns hash
 * @param {String} hashName
 * @param {String} hashData – which is needed to be wrapped
 * @return {String}
 */
function wrapHash(hashName, hashData) {
	let result = '';
	if (hashName) {
		hashData = hashData.slice(0, hashData.length - 2) + '\n';
		result += `$${hashName} = { \n ${hashData}};\n`;
	} else {
		result = hashData;
	}

	return result;
}
/**
 * Returns composed line for styl file
 * @param {String} varName
 * @param {String} varValue
 * @param {Boolean} [isInHash=false] – does variable belong to hash
 * @return {String}
 */

function composeStylusLine(varName, varValue, isInHash = false) {
	if (isInHash) {
		return `\t${varName}: ${varValue},\n`;
	}
	return `$${varName} = ${varValue};\n`;

}
/**
 * Returns part of .styl file with all variables from HTML
 * @param {String} string – HTML
 * @param {String=} name – hash name
 * @return {String}
 */
function composePageColors(page) {
	let map = parser.parseTable(page.data, page.useHex),
		result = '';

	Object
		.keys(map)
		.forEach(key => {
			result += composeStylusLine(key, map[key], !!page.name)
		});

	return wrapHash(page.name, result);
}
/**
 * Returns variables from page as an object
 * @param {String} string – HTML
 * @param {String=} name – hash name
 * @return {String}
 */
function composeColorsObject(page) {
	let map = parser.parseTable(page.data, page.useHex);
	let newObj = {};

	if (page.name) {
		newObj[page.name] = map;
	} else {
		newObj = map;
	}
	return newObj;
}

/**
 * Returns promise for writing from confluence to .styl file
 * @param {Array.<Object.<{data:String, name:String}>>} dataArray
 * @param {String} destination – file path
 * @return {Promise.<String>}
 */
function generateFile(dataArray, destination) {
	let result;
	let isJS = path.extname(destination).toLowerCase() === '.js';
	if (isJS) {
		result = {};
		dataArray.forEach(page => {
			objectAssign(result, composeColorsObject(page));
		});
		result = `export default ${toSource(result)};`;
	} else {
		result = '';
		dataArray.forEach(page => {
			result += composePageColors(page)
		});
	}

	return writeToFile(result, destination);
}