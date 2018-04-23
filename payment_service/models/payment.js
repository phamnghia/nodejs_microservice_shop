const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/********** Define Schema ***********/
let PaymentSchema = new Schema({
	order_id					: String,
	amount 						: Number,
	items 						: [],
	user 							: String,
	status 						: {default : "new", type: String},
  created_at        : {default : new Date, type: Date}
});

/********** Export Schema ***********/
module.exports = mongoose.model('Payment', PaymentSchema);