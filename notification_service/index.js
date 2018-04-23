if(process.env.DEV_MODE == "dev") require('dotenv').load();

const mongoose = require('mongoose');
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser());

// Model
const Notification = require("./models/notification");

// Running app
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`)
	.then(() => {
		app.listen(process.env.PORT || 8004, () => console.log(`Notification service is running on port ${process.env.PORT || 8004}`));
	}).catch(err => {
		console.log("Can't connect database");
	});


app.post("/push-notification", async (req, res) => {
	let noti = new Notification;

	noti.message = req.body.message,
	noti.device = req.body.device;

	await noti.save();

	console.log(`Sent message "${noti.message}" to ${noti.device}`);

	res.send(null);
});
