const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	postTitle: {
		type: String,
		required: true
	},
	postDescription: {
		type: String,
		required: true
	},
	postContent: {
		type: String,
		required: true
	},
	username: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: new Date()
	}
});

const Post = mongoose.model('posts', PostSchema);

module.exports = Post;
