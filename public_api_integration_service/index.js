if(process.env.DEV_MODE == "dev") require('dotenv').load();

const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

const defaultProtocol = process.env.USE_SSL == 1 ? "https" : "http";

// Product proxy management
app.use(`/${process.env.PRODUCT_SERVICE_PREFIX}`, proxy(
	`${defaultProtocol}://${process.env.PRODUCT_SERVICE_DOMAIN}`, {
		filter: function(req, res) {
			let rules = [
				// Get list product
				{method : "GET", path : `/${process.env.PRODUCT_SERVICE_PREFIX}/list`},
				// Get product detail
				{method : "GET", path : new RegExp(`^\/${process.env.PRODUCT_SERVICE_PREFIX}\/[a-zA-Z0-9]+\/detail$`, "g")}
			]
			
			return isAcceptableRequest(rules, req);
		}
	}
));

// Payment proxy management
app.use(`/${process.env.PAYMENT_SERVICE_PREFIX}`, proxy(
	`${defaultProtocol}://${process.env.PAYMENT_SERVICE_DOMAIN}`, {
		filter: function(req, res) {
			let rules = [
				{method : "GET", path : `/${process.env.PAYMENT_SERVICE_PREFIX}/list`},
				{method : "POST", path : `/${process.env.PAYMENT_SERVICE_PREFIX}/create`},
				{method : "POST", path : new RegExp(`^\/${process.env.PAYMENT_SERVICE_PREFIX}\/payment-callback`)}
			]
			
			return isAcceptableRequest(rules, req);
		}
	}
));

// Order proxy management
app.use(`/${process.env.ORDER_SERVICE_PREFIX}`, proxy(
	`${defaultProtocol}://${process.env.ORDER_SERVICE_DOMAIN}`, {
		filter: function(req, res) {
			let rules = [
				{method : "GET", path : `/${process.env.ORDER_SERVICE_PREFIX}/list`},
				{method : "GET", path : new RegExp(`^\/${process.env.ORDER_SERVICE_PREFIX}\/[a-zA-Z0-9]+\/detail`)},
				{method : "POST", path : `/${process.env.ORDER_SERVICE_PREFIX}/create`},
			]
			
			return isAcceptableRequest(rules, req);
		}
	}
));

// Util Methods
function isAcceptableRequest(rules, req){
	let canPass = false;

	for(let rule of rules){
		let isAcceptableMethod = req.method == rule.method;
		let isAcceptablePath = false;

		if(rule.path && rule.path.__proto__.constructor == String) isAcceptablePath = rule.path == req.originalUrl;
		if(rule.path && rule.path.__proto__.constructor == RegExp) isAcceptablePath = rule.path.test(req.originalUrl);
		
		canPass = isAcceptableMethod && isAcceptablePath;

		if(canPass) break;
	}
	
	return canPass;
}

app.listen(
	process.env.PORT || 8888, 
	() => console.log(`Public API management system is running on port ${process.env.PORT || 8888}`)
);