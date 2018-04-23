const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/********** Define Schema ***********/
let ReportSchema = new Schema({
	type 							: String, // order_count | revenue
	value 						: String,
	ref								: String,
  created_at        : {default : new Date, type: Date}
});

/********** Export Schema ***********/
module.exports = mongoose.model('Report', ReportSchema);


// order_count: số lượt đơn hàng đặt
// revenue: thống kê doanh thu