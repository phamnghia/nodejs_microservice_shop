const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/********** Define Schema ***********/
let ProductSchema = new Schema({
	name 							: String,
	price 						: Number,
	stock 						: Number,
	updated_by 				: String,
	updated_at 				: {default : new Date, type: Date},
  created_at        : {default : new Date, type: Date}
});

/********** Export Schema ***********/
module.exports = mongoose.model('Product', ProductSchema);