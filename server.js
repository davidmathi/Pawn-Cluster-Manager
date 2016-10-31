
var stormpath=require('express-stormpath');
var paypal=require('paypal-rest-sdk');



// Node Modules
var express = require("express"),
    bodyParser = require("body-parser"),
	morgan = require("morgan");
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
var Utilities = require("./lib/utilities.js");

app.use(cookieParser('my 114 o2o'));
app.use(session({
  maxAge : 1000*60*60*24 ,
  cookie : {
    maxAge : 1000*60*60*24 // expire the session(-cookie) after
  }
}));



//paypal
var config = {
  "port" : 8587,
  "api" : {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "AWZ1s6-hO0Tv42k6gS_RvEp0QbWoS1LtXHtDPBPuVtvPfFX-QrE7rTzUPMJadvfYSgROmqD89ckMpPjq",  // your paypal application client id
    "client_secret" : "EIi0ovjG-8FSgJc_hWZp-MQB4nCrT8kp40XH3CtRB5kOd4DTC3wiwe1ffauHE1GEwx7UJl1SFymx0vBd" // your paypal application secret id
  }
}

paypal.configure(config.api);



var App = {
	config: require("./config.json"),
	build_type: "--dev",

	middlewares: function() {
		var t = this;

		/* Middlewares */
		app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", ['GET','DELETE','PUT', 'POST']);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			return next();
		});

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
  			extended: true
		}));

                app.use(stormpath.init(app, {
  website: true
                  }));

		if(t.build_type=="--dev") {
			app.use(require("morgan")("dev"));
		}
		// ===
	},

	injectToTemplate: function(data) {
		// these variables will be available globally while rendering
		app.use(function(req, res, next) {
			res.locals = Utilities.mergeObjects(res.locals, data);
			return next();
		});
	},

	setupRoutes: function() {
		/* Application routes */
		app.use("/", require("./saveobj.js"));
                app.use("/dashboard.jade",require("./saveobj.js"));
                app.use("/paypal.jade",require("./saveobj.js"));
               app.use("/success",require("./saveobj.js"));
               app.use("/cancel",require("./saveobj.js"));

		//app.use("/users", require("./modules/authentication/authentication.js"));
		//app.use("/homepage", require("./modules/homepage/shorten.js"));
    	//app.use("/editor", require("./modules/editor/dashboard.js"));
		// ====
	},


	start: function(port) {
		app.listen(port, function()  {
			console.log('Listening on http://localhost:%d', port);
		});
	},

	init: function() {
		var t = this;

		if(process.argv.length == 3 || process.argv.length == 4) {
			t.build_type = process.argv[2];
		} else {
			console.log("Error: Incorrect number of arguments provided");
			console.log("Syntax: \n npm run prod");
			return;
		}

		switch(t.build_type) {
			case "--prod":
				t.config = t.config.production;
				break;

			case "--dev":
				t.config = t.config.development;
				break;

			default:
				console.log("Error: incorrect argument provided");
				return;
		}

		/* Global app configurations */
		

		/* Load middlewares */
		t.middlewares();
		// ====

		/* set view engine, path */
		app.set("views", "./views");
		//app.engine('html', require('jade').renderFile);
		//app.set('view engine', 'html');
		app.set("view engine", "jade");
		// ====

		/* serve static files */
		app.use("/css", express.static(__dirname + "/static/styles"));
		app.use("/img", express.static(__dirname + "/static/images"));
		app.use("/js", express.static(__dirname + "/static/scripts"));
		// ====

		t.injectToTemplate({
			staticURL: t.config.baseURL,
			env: app.locals.settings.env,
			config: t.config
		});

		t.setupRoutes();
		t.start(t.config.port);
	}
};


App.init();
module.exports = app;