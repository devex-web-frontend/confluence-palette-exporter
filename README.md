# ConfluenceHelper
Plugin for confluence reading/writing
## How to use
### Authentification
Before any transaction you need to auth
If you want to save credentials – provide flag to `auth` method
Your credentials would be saved to `credentials.json` in the root directory of your project
**DO NOT FORGET TO ADD CREDENTIALS.JSON TO .GITIGNORE**
```
confluence.auth(true)
	.then(function() {
		return readToFile(pagesToRead, '/test/out/test.styl');
	}
	.then(done)
	.catch(errorHandler);`
```
### Reading color palette from confluence
Destination file can have `.js` or `.styl` extname.
#### To single file
```
var pagesToRead = [
  158202027, //plane page id
  {
    id: 103777451, // confluence page id
		name: 'darkScheme'  // if name is provided, all colors
		                    //would be placed into hash with same name
	}, {
		id: 104825455,
		useHex: true // if true, colors would be saved in HEX format 
		            //(by default they are saven in rgb())
	}];

confluence.auth(true)
	.then(function() {
		return readToFile(pagesToRead, '/test/out/test.styl');
	}
	.then(done)
	.catch(errorHandler);`
```
#### To multiple files
```
var config = [{
	pages: [103777451, 103777451], //array of page ids
	destination: 'dark.styl'
}, {
	pages: pagesToRead, // or config with same format as for readToFile
	destination: '/light.styl'
}];
// readToMultipleFiles is resolved with array of messages for each file
confluence.auth(true)
	.then(function() {
		return confluence.readToMultipleFiles(config);
	}
	.then(done)
	.catch(errorHandler);

```

### Writing to confluence
```
var sourceFolder ='src/contentToPublish';
var pagesToWrite = {
	NumericStepperApi: 108139548 //target page id,
	projectDescription: 108249236
};
// plugin would search for NumericStepperApi.html and projectDescription.html in source folder 
// and publish its contents to provided pages

confluence.auth(true)
	.then(function() {
		return confluence.write(pagesToWrite, sourceFolder);
	}
	.then(done)
	.catch(errorHandler);
```

### Chaining tasks
```
function done(result) {
	if (!Array.isArray(result)) {
		result = [result];
	}
	result.forEach(res => {console.log(res.green)});
}

confluence.auth(true)
	.then(function() {
		return confluence.write(pagesToWrite, sourceFolder).then(done);
	}
	.then(function() {
		return confluence.readToMultipleFiles(config).then(done)
	}
	.catch(errorHandler);
```