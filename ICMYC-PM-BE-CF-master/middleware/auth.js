const jwt = require("jsonwebtoken");
const config = require("config");
var request = require("request");

module.exports = function(req, res, next) {
  //get token from header
 //console.log("Starting auth");
	
  const token = req.header("Authorization");
 //console.log(token);

  let language = req.header("Accept-Language");
 //console.log(language);

  if(language === undefined || language.length !== 2){
    language = "en";
  }
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied"
    });
  }

  try {


var options = { method: 'GET',
  url: config.get("production_profile_url"),
  qs: { channel: 'swm-android' },
  headers: 
   { 'postman-token': 'c132ee7a-4c50-fc5f-62f4-b7ed665ce0a7',
     'cache-control': 'no-cache',
     'accept-language': 'en',
     //accept: 'application/json;version=1.0',
     'accept': 'application/json,application/vnd.profile.api+json;version=1.0',
     'authorization' : token } };

  //console.log(options);
  //console.log("requesting profile api");

request(options, function (error, response, body) {

  if (error) throw new Error(error);
  
 // console.log(body);

  const body_json = JSON.parse(body);
  if(body_json.data === undefined){
    return res.status(401).json({ msg: "Token is not valid" });
  }
  req.user = body_json.data;
  if(req.user !== undefined){
    req.user.language = (language !== undefined || language ==="" ) ? language : "en";

  }
  // console.log(req.user)
  next();
  
});
    
  } catch (err) {
    console.log(err)
    res.status(401).json({ msg: "Token is not valid" });
  }
};
