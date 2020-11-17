const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');

// create body parser application
const urlencodedParser = bodyparser.urlencoded({ extended: false });

// Load User model
const User = require('../models/UserDetails');
const Post = require('../models/Posts');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.use(fileUpload());

// add post route
// GET Route
// @ route /users/addPost
// @ private
router.get('/create-post', ensureAuthenticated, async (req, res) =>
	res.render('addPost', {
		user: req.user
	})
);

// show all posts page
// GET Route
// @ route /users/show-all-posts
// @ private
router.get('/show-all-posts', ensureAuthenticated, async (req, res) => {
	const results = await Post.find({});
	res.render('postResults', {
		results,
		user: req.user
	});
});

// Insert post into database
// GET Route
// @ route /users/addPost
// @ private
router.post('/submitPost', ensureAuthenticated, (req, res) => {
	Post.create(req.body, (error, post) => {
		console.log(req.body);
		res.redirect('/');
	});
});

// Login route
// GET Route
// @ route users/login
// @ public
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// searchResults route
// GET Route
// @ route users/searchResult
// @ public
router.get('/searchResult', ensureAuthenticated, (req, res) =>
	res.render('searchResult')
);

// Register route
// GET Route
// @ route users/register
// @ public
router.get('/register', forwardAuthenticated, (req, res) =>
	res.render('register')
);



// Dashboard route
// GET Route
// @ route /users/dashboard
// @ public
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	const results = await Post.find({});
	res.render('dashboard', {
		results,
		user: req.avatar
	})
});

// Parent route
// GET Route
// @ route /users/parent
// @ public
router.get('/parents', ensureAuthenticated, (req, res) =>
	res.render('parents', {
		user: req.user
	})
);

// Education route
// GET Route
// @ route /users/education
// @ public
router.get('/education', ensureAuthenticated, (req, res) =>
	res.render('education', {
		user: req.user
	})
);

// Elderly route
// GET Route
// @ route /users/elderly
// @ public
router.get('/elderly', ensureAuthenticated, (req, res) =>
	res.render('elderly', {
		user: req.user
	})
);

// Get all users route
// GET Route
// @ route /users/allPosts
// @ public
router.get('/allPosts', ensureAuthenticated, async (req, res) => {
	await User.find({}, function(err, result) {
		if (err) throw err;
		searchResults = result;
	});
	await Post.find({}, function(err, result) {
		if (err) throw err;
		postResults=result;
	})
	res.render('allPosts', { results: searchResults, user: req.user, result: postResults });
});

// Register handle
// POST Route
// @ route /users/register
// @ public
router.post('/register', (req, res) => {
	const { firstname, lastname, email, password, password2 } = req.body;
	let errors = [];

	// Check required fields have been correctly filled in
	if (!firstname || !lastname || !email || !password || !password2) {
		// If any of above is true push the error below
		errors.push({ msg: 'Please fill in all fields' });
	}

	// Check if both passwords match
	if (password != password2) {
		errors.push({ msg: 'Passwords do not match' });
	}

	// check that the password is more than 8 characters long
	if (password.length < 8) {
		errors.push({ msg: 'Password should be at least 8 characters' });
	}

	if (errors.length > 0) {
		// Registration validation
		res.render('register', {
			errors,
			firstname,
			lastname,
			email,
			password,
			password2
		});
	} else {
		// Validation passed
		User.findOne({ email: email }).then(user => {
			if (user) {
				// User Exists
				errors.push({ msg: 'Email is already registered' });
				res.render('register', {
					errors,
					firstname,
					lastname,
					email,
					password,
					password2
				});
			} else {
				// Get users gravatar
				const avatar = gravatar.url(email, {
					s: '200',
					r: 'pg',
					d: 'mm'
				});

				const newUser = new User({
					firstname,
					lastname,
					email,
					avatar,
					password
				});

				// Hash password with bcrypt
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						// Set password to hashed
						newUser.password = hash;
						// Save new user
						newUser
							.save()
							// redirect user once registered to login page
							.then(user => {
								req.flash(
									'success_msg',
									'Congratulations you are now registered and can now log in.'
								);
								res.redirect('/users/login');
							})
							.catch(err => console.log(err));
					})
				);
			}
		});
	}
});

// Login handle
// POST Route
// @ route /users/login
// @ public
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Logout handle
// GET Route
// @ route /users/logout
// @ public
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You have successfully logged out');
	res.redirect('/users/login');
});

// Search all posts
// POST Route
// @ route /users/searchResult
// @ public
router.post(
	'/searchResult',
	ensureAuthenticated,
	urlencodedParser,
	async (req, res) => {
		if (req.body.search === '') {
			res.redirect('/');
		}

		await Post.find({ postTitle: req.body.search }, function(err, result) {
			if (err) throw err;
			searchResults = result;
		});
		res.render('postResults', {
			results: searchResults,
			user: req.user
		});
	}
);

module.exports = router;
