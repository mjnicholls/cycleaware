const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String
	},
	date: {
		type: Date,
		default: new Date()
	}
});

const User = mongoose.model('registered_users', UserSchema);

module.exports = User;
