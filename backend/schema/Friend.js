const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let friendSchema = new Schema({
	firstName: String,
	lastName: String, 
	country: String, 
	city: String,
	phone: [String], 
	email: [String],
	timeZone: {type: ObjectId, ref: 'TimeZone'}
});

class FriendClass {

}

friendSchema.loadClass(FriendClass);
module.exports = db.model('Friend', friendSchema);

