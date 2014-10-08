'use strict';

Object.prototype.clone = function (obj) {
    if(obj === null || typeof(obj) != 'object'){
        return obj;
    }
    var temp = obj.constructor(); // changed

    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            temp[key] = Object.clone(obj[key]);
        }
    }
    return temp;
};
Object.prototype.merge = function (priorityObject) {
    var temp = Object.clone(this);
    priorityObject = priorityObject || {};
    for (var i in priorityObject) {
        if (priorityObject.hasOwnProperty(i)) {
            temp[i] = priorityObject[i] || temp[i];
        }
    }
    return temp;
};