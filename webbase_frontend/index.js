if(process.env.DEV_MODE == "dev") require('dotenv').load();

const express = require("express");
const rp = require("request-promise");
const nunjucks = require("nunjucks");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require('connect-mongo')(session);
const app = express();

app.use(bodyParser());

let env = nunjucks.configure('views', {
	autoescape: true,
	watch : true,
	express: app
});


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'anything...:)',
	store: new MongoStore({
		url: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}`,
	})
}))

app.use(async (req, res, next) => {
	res.locals.session = req.session;
	next();
})


// home
app.get("/", async (req, res) => {
	let products = JSON.parse(await rp.get(`http://${process.env.PUBLIC_API_SERVICE}/${process.env.PRODUCT_PREFIX}/list`));
	res.render("index.html", {products});
});

// login
app
.get("/login", async (req, res) => {
	res.render("login.html");
})
.post("/login", async (req, res) => {
	req.session.username = req.body.username
	res.redirect("/")
})

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

// cart
app.post("/add-to-basket", async (req, res) => {
	if(req.session.username){
		req.session.basket = req.session.basket ? req.session.basket : {};

		req.session.basket[req.body.product] = req.session.basket[req.body.product] ? req.session.basket[req.body.product] + 1 : 1;

		res.json({success : true});
	} else {
		res.json({
			success : false,
			message : "Vui lòng đăng nhập trước khi đặt hàng"
		});
	}
});

app.get("/cart", async (req, res) => {
	req.session.basket = req.session.basket ? req.session.basket : {};
	let basket = [];
	for(let pid of Object.keys(req.session.basket)){
		let product = JSON.parse(await rp.get(`http://${process.env.PUBLIC_API_SERVICE}/${process.env.PRODUCT_PREFIX}/${pid}/detail`));

		basket.push({
			id : product._id,
			name : product.name,
			price : product.price,
			quantity : req.session.basket[pid],
			total_cost : req.session.basket[pid]*product.price
		});
	}

	let total_cost = basket.map(b => b.total_cost).reduce((a, b) => a + b, 0);

	res.render("cart.html", {basket, total_cost});
});

// payment
app.post("/checkout", async (req, res) => {
	req.session.basket = req.session.basket ? req.session.basket : {};
	let basket = [];
	for(let pid of Object.keys(req.session.basket)){
		basket.push({
			id : pid,
			quantity : req.session.basket[pid]
		});
	}

	let order = await rp.post(`http://${process.env.PUBLIC_API_SERVICE}/${process.env.ORDER_PREFIX}/create`, {
		headers : {"Content-Type" : "application/json"},
		json : true,
		body : {
			"username" : req.session.username,
			"address" : "Ha noi",
			"phone" : "0917969996",
			"products" : basket
		}
	})


	let payment = await rp.post(`http://${process.env.PUBLIC_API_SERVICE}/${process.env.PAYMENT_PREFIX}/create`, {
		headers : {"Content-Type" : "application/json"},
		json : true,
		body :{
			"order_id" : order._id,
			"user" : req.session.username
		}
	})

	req.session.basket = {};
	res.json({success : true})
});






app.listen(9999, () => console.log("Frontend is running on port 9999"));