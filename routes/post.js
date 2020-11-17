const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
var bodyparser = require('body-parser');

// create body parser application
var urlencodedParser = bodyparser.urlencoded({ extended: false });

// Load Post model
const Post = require('../models/Posts');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Database configuration
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

// add post route
router.get('/posts', ensureAuthenticated, (req, res) =>
	res.render('posts', {
		user: req.user
	})
);

module.exports = router;
