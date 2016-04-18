'use strict';

var buffer = require('./helpers/buffer.js');
var fileGenerator = require('./helpers/fileGenerator.js');
var Promise = require('promise');
var colors = require('colors');

module.exports = {
	readToFile: readToFile,
	readToMultipleFiles: readToMultipleFiles
};

/**
 * Returns promise for reading page from confluence
 * @param {Object.<{id:string|number, pageName: ?string}>} page data
 * @return {Promise.<{name: String, data: String, useHex: Boolean}>}
 */
function readPage(page) {
	var pageId = undefined,
	    pageName = undefined;

	if (typeof page === 'number' || typeof page === 'string') {
		pageId = page;
	} else {
		pageId = page.id;
		pageName = page.name;
	}
	return new Promise(function (resolve, reject) {
		buffer.read(pageId).then(function (respond) {
			resolve({
				name: pageName,
				data: respond.body.view.value,
				useHex: page.useHex
			});
		})['catch'](function (err) {
			reject('Error reading: ' + err);
		});
	});
}

/**
 * Returns promise for reading pages from confluence and writing its parsed data into one file
 * @param {Array.<Object.<{id:string|number, pageName: ?string}>>} pages
 * @param {String} [destination="test.styl"] destination file
 * @return {Promise.<String>}
 */
function readToFile(pages) {
	var destination = arguments.length <= 1 || arguments[1] === undefined ? 'test.styl' : arguments[1];

	var promises = pages.map(function (page) {
		return readPage(page);
	});

	return Promise.all(promises).then(function (result) {
		return fileGenerator.write(result, destination);
	})['catch'](function (err) {
		return Promise.reject(err);
	});
}
/**
 * Returns promise for reading pages from confluence and writing its parsed data into multiple files
 * @param {Array.<Object.<{pages:array.<string|object|number>, destination:string}>>} configArray
 * @return {Promise.<String>}
 */
function readToMultipleFiles(configArray) {

	var promises = configArray.map(function (config) {
		return readToFile(config.pages, config.destination);
	});

	return Promise.all(promises);
}