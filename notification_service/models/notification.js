const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/********** Define Schema ***********/
let NotificationSchema = new Schema({
	device 						: String,
	message 					: String,
  created_at        : {default : new Date, type: Date}
});

/********** Export Schema ***********/
module.exports = mongoose.model('Notification', NotificationSchema);