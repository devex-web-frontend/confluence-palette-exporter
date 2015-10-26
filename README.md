# ConfluenceHelper
Plugin for confluence reading/writing
## How to use
### Reading color palette from confluence
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

confluence.readToFile(pagesToRead, '/test/out/test.styl')
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
confluence.readToMultipleFiles(config)
		.then(done)
		.catch(errorHandler);

```

### Writing to conflunce
```
var sourceFolder ='src/contentToPublish';
var pagesToWrite = {
	NumericStepperApi: 108139548 //target page id,
	projectDescription: 108249236
};
// plugin would search for NumericStepperApi.html and projectDescription.html in source folder 
// and publish its contents to provided pages
confluence.write(pagesToWrite, sourceFolder)
		.then(done)
		.catch(errorHandler);
```