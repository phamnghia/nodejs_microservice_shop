if(process.env.DEV_MODE == "dev") require('dotenv').load();

const mongoose = require('mongoose');
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser());

// Model
const Payment = require("./models/payment");

// Handle Rejection
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.stack);
});

// Running app
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`)
	.then(() => {
		app.listen(process.env.PORT || 8002, () => console.log(`Payment service is running on port ${process.env.PORT || 8002}`));
	}).catch(err => {
		console.log("Can't connect database");
	});

// Tạo hoá đơn
app.post("/create", async (req, res) => {
	let payment = new Payment;
	let order = JSON.parse(await rp.get(`http://${process.env.ORDER_SERVICE}/${req.body.order_id}/detail`));
	
	payment.order_id = order._id;
	payment.amount = order.total_cost;
	payment.items = order.items;
	payment.status = "success";
	payment.user = req.body.user;

	await payment.save();

	await rp.post(`http://${process.env.ORDER_SERVICE}/${req.body.order_id}/update-payment-status`, {
		body : {status : "success"},
		json: true,
		headers : {
			"Content-Type" : "application/json"
		}
	});

	addReport(payment.amount, payment._id);

	res.json(payment);
});

// Lấy danh sách payment
app.get("/list", async (req, res) => {
	let payments = Payment.find({});

	res.json(payments);
});

// Webhook để payment merchant gọi vào khi thanh toán thành công
app.post("/payment-callback", async (req, res) =>{

});


// Utils
async function addReport(value , ref){
	try{
		await rp.post(`http://${process.env.REPORT_SERVICE}/add-report`, {
			headers : {"Content-Type" : "application/json"},
			body : {value, ref, type : "revenue"},
			json : true
		});
	} catch(e) {console.log(e)}
}