[![Build Status](https://travis-ci.org/aptoma/ass-client-node.svg)](https://travis-ci.org/aptoma/ass-client-node)

# ass-client

Node client for Aptoma Smooth Storage

## Installation

This module is installed via npm:

	$ npm install ass-client


## Examples


### Upload and resize image

```
var ass = require('ass-client')({
	httpUrl: 'http://ass.com',
	httpsUrl: 'https://ass.com',
	accessToken: 'secret',
	username: 'foobar'
});

ass.uploadImage('my.jpg').then(function (res) {
	console.log('Image uploaded', res.body);

	var signedUrl = ass.createImageUrl(res.body.id, { resize: { width: 10, height: 10 } });
	//create a signed url for the uploaded image in a different size
	console.log('Smaller image', url);
})
```


## Documentation

ASS(opts, opts.httpUrl, opts.httpsUrl, opts.accessToken, opts.username) 
-----------------------------
Create ASS API instance

**Parameters**

**opts**: Object, Create ASS API instance

**opts.httpUrl**: String, Create ASS API instance

**opts.httpsUrl**: String, Create ASS API instance

**opts.accessToken**: String, Create ASS API instance

**opts.username**: String, Create ASS API instance


getDefaultHeaders(add) 
-----------------------------
Get default headers

**Parameters**

**add**: Object, headers

**Returns**: Object, 

upload(endpoint, file) 
-----------------------------
Upload file to endpoint

**Parameters**

**endpoint**: String, Upload file to endpoint

**file**: String | stream.Readable, full path to the file or stream.Readable

**Returns**: Promise, Resolves with response object

uploadFile(file) 
-----------------------------
Upload a file to /files endpoint

**Parameters**

**file**: String | stream.Readable, full path to the file or stream.Readable

**Returns**: Promise, Resolves with response object

uploadImage(file) 
-----------------------------
Upload a

**Parameters**

**file**: String | stream.Readable, full path to the file or stream.Readable

**Returns**: Promise, Resolves with response object

post(endpoint) 
-----------------------------
Make a post request to an endpoint

**Parameters**

**endpoint**: String, Make a post request to an endpoint

**Returns**: Promise, Resolves with response object

get(endpoint) 
-----------------------------
Make a get request to an endpoint

**Parameters**

**endpoint**: String, Make a get request to an endpoint

**Returns**: Promise, Resolves with response object

getUrl(endpoint, http) 
-----------------------------
Get full url to ASS endpoint, defaults to https url

**Parameters**

**endpoint**: String, Get full url to ASS endpoint, defaults to https url

**http**: Boolean, if we should return http url

**Returns**: String, 

createImageUrl(id, actions) 
-----------------------------
Create a signed url from image id and actions

**Parameters**

**id**: Integer, image id

**actions**: Object, Create a signed url from image id and actions

**Returns**: String, 

createSignature(url) 
-----------------------------
Create signature for a image or file url

**Parameters**

**url**: String, Create transformation signature

**Returns**: String, 
