if(process.env.DEV_MODE == "dev") require('dotenv').load();

const mongoose = require('mongoose');
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser());

// Model
const Report = require("./models/report");

// Running app
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`)
	.then(() => {
		app.listen(process.env.PORT || 8000, () => console.log(`Report service is running on port ${process.env.PORT || 8000}`));
	}).catch(err => {
		console.log("Can't connect database");
	});


app.post("/add-report", async (req, res) => {
	let report = new Report;

	report.type = req.body.type;
	report.value = req.body.value;
	report.ref = req.body.ref;

	await report.save();

	res.send(null);
});

app.get("/get-revenue-report", async (req, res)=> {
	let reports = await Report.find({type : "revenue"});

	let total_revenue = reports.map(r => r.value).reduce((a,b) => a + b, 0);

	res.json({
		total: total_revenue,
		records : reports
	});
});


app.get("/get-order-count-report", async (req, res) => {
	let reports = await Report.find({type : "order_count"});

	res.json({
		total : reports.length,
		records : reports
	})
});