const jwt = require("jsonwebtoken");
const config = require("config");
var request = require("request");

const fetchDropdown = async (req, res, end_point) => {
  //get token from header
  return new Promise((resolve, reject) =>{
 
  const token = req.header("Authorization");
  let language = req.header("Accept-Language");
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
  url: end_point,
  qs: { channel: 'swm-android' },
  headers: 
   { 
     
    'Accept-Language':language,
     //accept: 'application/json;version=1.0',
     accept: 'application/json,application/vnd.profile.api+json;version=1.0',
     Authorization: token } };
//    console.log(options) 
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  
//   console.log(body);

  const body_json = JSON.parse(body);
  if(body_json.data === undefined){
   resolve([]) 
  }
//   console.log(body_json["data"])
  resolve(body_json["data"]) ;
  
});
    
  } catch (err) {
    console.log(err)
    reject({ msg: "Token is not valid" });
  }

}) 
};


module.exports = fetchDropdown;
