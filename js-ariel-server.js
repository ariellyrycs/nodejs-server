var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path');
require('./tools.js');
module.exports.runServer = function (config) {
    'use strict';
    var route,
        _getUrlValue = function (req) { //get url values example www.ariel.com?student=12
            var fullUrl = url.parse(req.url, true),
                valuesInObjectOFormat = fullUrl.query;
            return valuesInObjectOFormat;
        },
        _getUrl = function (req) { //url
            var fullUrl = url.parse(req.url, true),
                pathName = fullUrl.pathname,
                defaultRoute,
                file;
            if(/(?=\/).*?\..*?(?=\/)\/$/.test(pathName)) {
                file = pathName.substring(0, pathName.length - 1);
            } else if(pathName.charAt(pathName.length - 1) === '/') {
                file = pathName + 'index.html';
            } else {
                file = pathName;
            }
            defaultRoute = './' + config.defaultRoute + file;
            return defaultRoute;
        },
        _readFile = function () {
            var fileReference,
            data;
            try {
                fileReference = fs.openSync(route, 'r')
            } catch(err) {
                throw 404;
            }
            try {
                data = fs.readFileSync(route, "utf8");
            } catch (err) {
                throw 500;
            }
            fs.closeSync(fileReference);
            return data;
        },
        _reroute = function (route) {
            var routes = route.split('/'),
                length = routes.length - 1,
                i,
                alias = Object.clone(config.alias),
                tmpRoute = routes[0] + '/' + routes[1];
            for(i = 2; i < length; i += 1) {
                if(typeof alias[routes[i][0]] && alias[routes[i][0]] !== '..') {
                    tmpRoute += '/' + alias[routes[i]][0];
                    alias = alias[routes[i]][1];
                } else {
                   throw 404;
                }
            };
            tmpRoute += '/' + routes[routes.length - 1];
            return tmpRoute;
        },

        _requestExtension = function (fileName) {
            var matchExtension = new RegExp('(.*?)\.' + config.rewrite);
            if(matchExtension.test(fileName)) {
                fileName = fileName.replace(/\.[^\.]+$/, '.json');
            }
            return fileName;
        },

        _getContentType = function (route) {
            var ext = path.extname(route),
            contentType = 'text/html';
            switch (ext) {
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.xml':
                    contentType = 'text/css';
                    break;
            }
            return contentType;
        },

        _run = function (req, res) {
            var contentType,
                data,
                values;
            route = _getUrl(req);
            route = _requestExtension(route);

            try {
                route = _reroute(route);
                contentType = _getContentType(route);

                if(contentType === 'application/json'){
                    values = _getUrlValue(req);
                    data = require(route.replace(/\.[^\.]+$/, '.js')).apply(values);
                } else {
                    data = _readFile();
                }
                res.writeHead(202, {"Content-type": contentType});
                res.end(data);
            } catch(e) {
                console.error(e);
                res.writeHead(e);
                res.end("Sorry the page was not found");
            }
    };

    http.createServer(_run).listen(config.port, config.host, function () {
        console.log("Listening " + config.host + ":" + config.port);
    });

};