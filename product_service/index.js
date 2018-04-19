require('dotenv').load();
const mongoose = require('mongoose');
const express = require("express");
const app = express();

// Model
const Product = require("./models/product");

// Running app
mongoose.connect('mongodb://localhost/my_database')
	.then(() => {
		app.listen(80, () => console.log("Product service is running on port 80"));
	}).catch(err => {
		console.log("Can't connect database");
	});;


// Routes
app.get("/list", async (req, res) => {
	let products = await Product.find();
	res.json(products);
});

app.get("/:id/detail", async (req, res) => {
	let product = await Product.findById(req.params.id);

	if(product) res.json(product);
	else res.send(null);
});

app.post("/create", async (req, res) => {
	let product = new Product;

	product.name = req.body.name || "No name";
	product.stock = req.body.stock || 10;
	product.price = req.body.price ? req.body.price : 0;

	await product.save();

	res.json(product);
});

app.post("/:id/update", async (req, res) => {
	let product = await Product.findById(req.params.id);

	if(req.body.name) product.name = req.body.name;
	if(req.body.stock) product.stock = req.body.stock;
	if(req.body.price) product.price = req.body.price;

	await product.save();

	res.json(product);
});

app.post("/:id/delete", async (req, res) => {
	let product = await Product.findById(req.params.id);

	await product.remove();

	res.send(null);
});
