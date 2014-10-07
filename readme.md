#simple-nodejs-server
This library is to start a server and create every route secure and accurate way.

##Install
 - npm install simple-nodejs-server

##Example
 - Import and implement
```
var server = require('./server.js'),
    config = {
        port: 8080,
        host: '127.0.0.1',
        alias: {
            'admins' : ['admin', {
                'css': ['css']
            }],
            'user' : ['normal_user', {
                'images': ['img']
            }]
        },
        rewrite :'php',
        defaultRoute: 'webroot'
};
server.runServer(config);
```
 - `alias:` changes routes. 
 - `rewrite:` file extension to access to those files. 
 - `alias:` main route

##Run it:
```sh
node example.js
```
