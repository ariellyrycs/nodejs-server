
var server = require('./js-ariel-server.js'),
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