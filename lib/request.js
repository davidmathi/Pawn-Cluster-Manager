var request = require("request"),
    logger = require("./logger");


function errorTypes(err) {
  logger.log(
      "Error",
      "lib/request.js/makeRequest",
      err
    );
}

var r = {
  makeRequest: function(config, body, cb) {
    if(!config) config = {};

    if(!config.headers) {
      config.headers = {
        "Content-Type" : "application/json",
        "Accept": "application/json"
      }
    }

    if(!config.method) {
      config.method = "GET";
    }

    config.json = true;

    if (config.method === 'GET' || config.method === 'DELETE') {
      config.qs = body;
    } else if (config.method === 'POST' || config.method === 'PUT') {
      config.body = body;
    }

    request(config, function(err, res, body) {
      if(err) {
        errorTypes(err);
      }
      return cb(err, res, body);
    });
    return;
  }
}

module.exports = r;