var mongoose = require('mongoose');


var notifications = mongoose.Schema({
	    notif : String,
            date : Date
	
});

module.exports = mongoose.model('Notify', notifications);

