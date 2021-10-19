import Parse from 'parse/node';

export default function initParse() {
  let appId = process.env.PARSE_APPID!;
  let jsApiKey = process.env.PARSE_JSAPIKEY!;
  let masterKey = process.env.PARSE_MASTERKEY!;
  let serverURL = process.env.PARSE_SERVERURL!;

  Parse.initialize(appId, jsApiKey, masterKey);

  Parse.serverURL = serverURL;
}
