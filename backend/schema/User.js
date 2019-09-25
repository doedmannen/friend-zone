const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let userSchema = new Schema({
	username: String,
	password: String, 
	lang: String, 
	timeFormat: String, 
	dateFormat: String,
	friends: [{type: ObjectId, ref: 'Friend'}]
});

class UserClass {

}

userSchema.loadClass(UserClass);
module.exports = db.model('User', userSchema);

