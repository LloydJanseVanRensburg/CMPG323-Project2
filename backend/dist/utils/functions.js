"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectLength = exports.isDefined = exports.isString = exports.validateRegisterAuthBody = exports.validateLoginAuthBody = void 0;
var validateLoginAuthBody = function (body) {
    return (exports.isDefined(body) &&
        exports.objectLength(body) > 0 &&
        exports.isDefined(body.email) &&
        exports.isString(body.email) &&
        exports.isDefined(body.password) &&
        exports.isString(body.password));
};
exports.validateLoginAuthBody = validateLoginAuthBody;
var validateRegisterAuthBody = function (body) {
    return (exports.isDefined(body) &&
        exports.objectLength(body) > 0 &&
        exports.isDefined(body.username) &&
        exports.isString(body.username) &&
        exports.isDefined(body.email) &&
        exports.isString(body.email) &&
        exports.isDefined(body.password) &&
        exports.isString(body.password));
};
exports.validateRegisterAuthBody = validateRegisterAuthBody;
var isString = function (string) {
    return typeof string === 'string' || string instanceof String;
};
exports.isString = isString;
var isDefined = function (param) {
    if (param) {
        return true;
    }
    return false;
};
exports.isDefined = isDefined;
var objectLength = function (data) {
    var length = 0;
    for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            length++;
        }
    }
    return length;
};
exports.objectLength = objectLength;
