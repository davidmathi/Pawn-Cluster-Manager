var moment = require("moment");

var logger = {
	log: function(logType, location) {
		var d = moment(),
			params = arguments;
		delete params["0"];
		delete params["1"];
		console.log(
			logType + ": ", 
			d.format("DD/MM/YYYY hh:mm:ssA") + ",", 
			location, 
			"\n", 
			params
		);
	}
};

module.exports = logger;