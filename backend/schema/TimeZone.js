const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let timeZoneSchema = new Schema({
	name: String,
	age: Number 
});

class TimeZoneClass {

}

timeZoneSchema.loadClass(TimeZoneClass);
module.exports = db.model('TimeZone', timeZoneSchema);

