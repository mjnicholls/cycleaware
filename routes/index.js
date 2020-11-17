const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Post = require('../models/Posts');
// Homepage route that renders welcome ejs
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	const results = await Post.find({}).sort({date: -1}).catch();
	res.render('dashboard', {
		results,
		user: req.user,
		users: req.avatar,
	})
});
module.exports = router;
