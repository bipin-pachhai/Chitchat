
var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
	message: {
		type: String
	},
	sender: {
		type: String
	}
	},
	{
		timestamps: true
	}
);

var Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;