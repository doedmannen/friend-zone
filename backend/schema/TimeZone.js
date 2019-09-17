const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let timeZoneSchema = new Schema({
	short: String,
	dst: Boolean,
	dst_from: String,
	dst_offset: Number,
	dst_until: String,
	offset_raw: Number,
	name: String
});

class TimeZoneClass {

}

timeZoneSchema.loadClass(TimeZoneClass);
module.exports = db.model('TimeZone', timeZoneSchema);

