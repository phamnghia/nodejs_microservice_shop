if(process.env.DEV_MODE == "dev") require('dotenv').load();

const mongoose = require('mongoose');
const express = require("express");
const rp = require("request-promise");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser());

// Model
const Order = require("./models/order");

// Running app
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`)
	.then(() => {
		app.listen(process.env.PORT || 8003, () => console.log(`Order service is running on port ${process.env.PORT || 8003}`));
	}).catch(err => {
		console.log("Can't connect database");
	});



// Routes
app.post("/create", async (req, res) => {
	let order = new Order;

	order.username 		= req.body.username;
	order.address 		= req.body.address;
	order.phone 			= req.body.phone;
	order.items 			= [];

	for(let prod of req.body.products){
		let product = JSON.parse(await rp.get(`http://${process.env.PRODUCT_SERVICE}/${prod.id}/detail`));
		order.items.push({
			_id : product._id,
			name : product.name,
			quantity: prod.quantity,
			cost: product.price*prod.quantity
		});
	}

	order.total_cost = order.items.map(i => i.cost).reduce((a, b) => a + b, 0);

	await order.save();

	addReport(order._id)
	sendNotification(order.phone, `Cảm ơn ${order.username} đã lựa chọn mua hàng tại DEMO MICROSHOP!`);
	res.json(order)
});

app.get("/list", async (req, res) => {
	let orders = await Order.find();

	res.json(orders)
});

app.get("/:id/detail", async (req, res) => {
	let order = await Order.findById(req.params.id);

	res.json(order);
});

app.post("/:id/update-payment-status", async (req, res) => {
	let order = await Order.findById(req.params.id);

	order.status = req.body.status == "success" ? "payment_success" : "payment_error";

	await order.save();

	res.send("done");
});

app.post("/:id/reject", async (req, res) => {
	let order = await Order.findById(req.params.id);

	order.status = "rejected";

	await order.save();

	res.send("done");
});

app.post("/:id/approve", async (req, res) => {
	let order = await Order.findById(req.params.id);

	order.status = "pending";

	await order.save();

	res.send("done");
});


// Utils
async function addReport(ref){
	await rp.post(`http://${process.env.REPORT_SERVICE}/add-report`, {
		headers : {"Content-Type" : "application/json"},
		body : {value : 1, ref, type : "order_count"},
		json : true
	});
}

async function sendNotification(device, message){
	await rp.post(`http://${process.env.NOTIFICATION_SERVICE}/push-notification`, {
		headers : {"Content-Type" : "application/json"},
		body : {device, message},
		json : true
	});
}