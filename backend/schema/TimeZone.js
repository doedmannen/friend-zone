const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let timeZoneSchema = new Schema({
	short: String,
	dst: Boolean,
	dst_from: Number,
	dst_offset: Number,
	dst_to: Number,
	offset: Number,
	name: String
});

class TimeZoneClass {

}

timeZoneSchema.loadClass(TimeZoneClass);
module.exports = db.model('TimeZone', timeZoneSchema);

