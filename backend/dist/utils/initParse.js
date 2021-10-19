"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("parse/node"));
function initParse() {
    var appId = process.env.PARSE_APPID;
    var jsApiKey = process.env.PARSE_JSAPIKEY;
    var masterKey = process.env.PARSE_MASTERKEY;
    var serverURL = process.env.PARSE_SERVERURL;
    node_1.default.initialize(appId, jsApiKey, masterKey);
    node_1.default.serverURL = serverURL;
}
exports.default = initParse;
