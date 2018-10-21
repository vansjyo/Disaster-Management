var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	    reporter_ID: {type:String, unique:true},
        reporter_name: String,
		reporter_contact1: { type : String, required:true},
		reporter_contact2: { type : String, required:true},
		reporter_address: String,
		reporter_email: {type:String ,unique:true},
		found_name: String,
        found_address:String,
        found_state:String,
        found_city:String,
        found_pincode:String,
        found_description:String,
        found_date: Date,
        found_location:String,
		found_gender:String,
		found_age:Number,
		found_photo: String,
		status : String
});

module.exports = mongoose.model('Found', userSchema);

/*, validate: {
          validator: function(v) {
            return /\d{12}/.test(v);
          },
          message: '{VALUE} is not a valid phone number!'
        }*/