const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let userSchema = new Schema({
	name: String,
	password: String, 
	swe_lang: Boolean, 
	timeformat12: Boolean, 
	americanDate: Boolean
});

class UserClass {

}

userSchema.loadClass(UserClass);
module.exports = db.model('User', userSchema);

