'use strict';

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    extType = require('./ext.json');
require('./tools.js');

module.exports = (function () {
    var configDefault = {
        port: 8080,
        host: '127.0.0.1',
        rewrite :'php',
        defaultRoute: 'webroot'
        },
        that,
    Run = function (config) {
        this.config = config;
    };
    Run.prototype = {
        init : function (req, res) {
            var contentType,
                data,
                values;
            that.route = that._getUrl(req);
            that.route = that._requestExtension(that.route);
            try {
                that.route = that._reRoute(that.route);
                contentType = that._getContentType(that.route);
                if(contentType === 'application/json') {
                    values = that._getUrlValue(req);
                    data = require(that.route.replace(/\.[^\.]+$/, '.js')).apply(values);
                } else {
                    data = that._readFile();
                }
                res.writeHead(202, {"Content-type": contentType});
                res.end(data);
            } catch(e) {
                console.error(e);
                res.writeHead(e);
                res.end("Sorry the page was not found");
            }
        },
        _getUrlValue: function (req) { //get url values example www.ariel.com?student=12
            var fullUrl = url.parse(req.url, true),
                urlValues = fullUrl.query;
            return urlValues;
        },
        _getUrl: function (req) { //url
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
            defaultRoute = './' + this.config.defaultRoute + file;
            return defaultRoute;
        },
        _readFile: function () {
            var fileReference,
                data;
            try {
                fileReference = fs.openSync(this.route, 'r');
            } catch(err) {
                throw 404;
            }
            try {
                data = fs.readFileSync(this.route, "utf8");
            } catch (err) {
                throw 500;
            }
            fs.closeSync(fileReference);
            return data;
        },
        _reRoute: function (route) {
            var routes = route.split('/'),
                length = routes.length - 1,
                i,
                alias = Object.clone(this.config.alias),
                tmpRoute = routes[0] + '/' + routes[1];
            for(i = 2; i < length; i += 1) {
                if(alias[routes[i]] !== undefined && alias[routes[i][0]] !== '..') {
                    tmpRoute += '/' + alias[routes[i]][0];
                    alias = alias[routes[i]][1];
                } else {
                    throw 404;
                }
            }
            tmpRoute += '/' + routes[routes.length - 1];
            return tmpRoute;
        },
        _requestExtension: function (fileName) {
            var matchExtension = new RegExp('(.*?).' + this.config.rewrite);
            if(matchExtension.test(fileName)) {
                fileName = fileName.replace(/\.[^\.]+$/, '.json');
            }
            return fileName;
        },
        _getContentType: function (route) {
            var ext = path.extname(route).slice(1);
            return extType[ext];
        }
    };
    return function (newConfig) {
        this.newConfig = newConfig;
        this.start = function () {
            var config = configDefault.merge(this.newConfig);
            if(config.alias === undefined) {
                console.error("Error 404");
                console.error("It's necessary to specify route");
                return;
            }
            that = new Run(config);
            this.app = http.createServer(that.init);
            this.app.listen(config.port, config.host, function () {
                console.log("Listening " + config.host + ":" + config.port);
            });
        };
    };
}());