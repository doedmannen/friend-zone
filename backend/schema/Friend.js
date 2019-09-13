const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let friendSchema = new Schema({
	name: String,
	country: String, 
	city: String, 
	timeZone: {type: ObjectId, ref: 'TimeZone'}
});

class FriendClass {

}

friendSchema.loadClass(FriendClass);
module.exports = db.model('Friend', friendSchema);

