var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	    reporter_ID: {type:String, unique:true},
        reporter_name: String,
		reporter_contact1: { type : String, required:true},
		reporter_contact2: { type : String, required:true},
		reporter_address: String,
		reporter_pincode: Number,
		reporter_relation: String,
		reporter_email: {type:String ,unique:true},
		missing_name: String,
        missing_contact: String,
        missing_address:String,
        missing_state:String,
        missing_city:String,
        missing_pincode:String,
        missing_description:String,
        missing_date: Date,
        missing_time: String,
        missing_location:String,
		missing_gender:String,
		missing_age:Number,
		missing_photo: String,
		status : String
});

module.exports = mongoose.model('Missing', userSchema);