const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/********** Define Schema ***********/
let OrderSchema = new Schema({
	username					: String,
	address						: String,
	phone 						: String,
	items 						: [],
	total_cost 				: Number,
	status 						: {default : "new", type: String},
  created_at        : {default : new Date, type: Date}
});

/********** Export Schema ***********/
module.exports = mongoose.model('Order', OrderSchema);