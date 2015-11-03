[![Build Status](https://travis-ci.org/aptoma/ass-client-js.svg)](https://travis-ci.org/aptoma/ass-client-js)

# ass-client-js

JavaScript client for Aptoma Smooth Storage.

## Installation

This module is installed via NPM:

	$ npm install ass-client

## Examples

### Upload and resize image (in Node.js)

```javascript
var assClient = require('ass-client')({
	httpUrl: 'http://ass.com',
	httpsUrl: 'https://ass.com',
	accessToken: 'secret',
	username: 'foobar'
});

assClient.uploadImage('my.jpg').then(function (res) {
	var signedUrl = assClient.createImageUrl(res.id, {
		resize: {
			width: 100,
			height: 100
		}
	});
	// Create a signed URL for the uploaded image in a different size
	console.log('Smaller image', signedUrl);
});
```

### Upload and resize image (in browser)
```markup
<script src="ass-client-js/dist/ass-client.js"></script>
<script>
	var assClient = AssClient({
		httpUrl: 'http://ass.com',
		httpsUrl: 'https://ass.com',
		accessToken: 'secret',
		username: 'foobar'
	});

	assClient.uploadImage(file).then(function (res) {
		var signedUrl = assClient.createImageUrl(res.id, {
			resize: {
				width: 100,
				height: 100
			}
		});
		// Create a signed URL for the uploaded image in a different size
		console.log('Smaller image', signedUrl);
	});
</script>
```

## Documentation

ASS(opts)
-----------------------------
Create ASS API instance.

**Parameters**

**opts**: Object, Create ASS API instance

**opts.httpUrl**: String, URL to use for HTTP requests.

**opts.httpsUrl**: String, URL to use for HTTPS requests.

**opts.accessToken**: String, Token used for accessing the API and signing URLs.

**opts.username**: String, Username used in paths.


getDefaultHeaders(add)
-----------------------------
Get default headers.

**Parameters**

**add**: Object, Add headers

**Returns**: Object

upload(endpoint, file, \[headers\])
-----------------------------
Upload file to endpoint.

**Parameters**

**endpoint**: String, Upload file to endpoint

**file**: File | String | stream.Readable, File object, full path to the file or stream.Readable

**headers**: Object, Add additional headers

**Returns**: Promise, Resolves with response object

uploadFile(file, \[path\], \[headers\]).
-----------------------------
Upload a file to /files endpoint.

**Parameters**

**file**: File | String | stream.Readable, File object, full path to the file or stream.Readable

**path**: String, Additional path to append to /files

**headers**: Object, Add additional headers

**Returns**: Promise, Resolves with response object

uploadImage(file, \[headers\])
-----------------------------
Upload a image to /images endpoint.

**Parameters**

**file**: File | String | stream.Readable, File object, full path to the file or stream.Readable

**headers**: Object, Add additional headers

**Returns**: Promise, Resolves with response object

request(endpoint, \[data\], \[opts\])
-----------------------------
Make a request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**opts**: Object, Options to the request

**opts.http**: Boolean, Set to true if request should use HTTP instead of HTTPS URL

**opts.method**: String, Request method (GET/HEAD/POST/PUT/PATCH/DELETE)

**opts.headers**: Object, Add additional headers

**opts.timeout**: Number, Number of ms to wait before timing out

**opts.body**: String | Object, Data to send

**Returns**: Promise, Resolves with response object

get(endpoint, \[opts\])
-----------------------------
Make a GET request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

head(endpoint, \[opts\])
-----------------------------
Make a HEAD request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

post(endpoint, \[data\], \[opts\])
-----------------------------
Make a POST request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**data**: String | Object, Data to send as body

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

patch(endpoint, \[data\], \[opts\])
-----------------------------
Make a PATCH request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**data**: String | Object, Data to send as body

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

put(endpoint, \[data\], \[opts\])
-----------------------------
Make a PUT request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**data**: String | Object, Data to send as body

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

delete(endpoint, \[opts\])
-----------------------------
Make a DELETE request to an endpoint.

**Parameters**

**endpoint**: String, Make a request to an endpoint

**opts**: Object, [Options](#requestendpoint-data-opts) to request

**Returns**: Promise, Resolves with response object

getUrl(endpoint, http)
-----------------------------
Get full URL to ASS endpoint, defaults to https URL.

**Parameters**

**endpoint**: String, Get full url to ASS endpoint, defaults to https url

**http**: Boolean, if we should return http url

**Returns**: String

createImageUrl(id, actions)
-----------------------------
Create a signed URL from image id and actions.

**Parameters**

**id**: Integer, image id

**actions**: Object, Create a signed url from image id and actions

**Returns**: String

createSignature(url)
-----------------------------
Create signature for a image or file URL.

**Parameters**

**url**: String, Create transformation signature

**Returns**: String
