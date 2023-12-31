const express = require('express');
const router = express.Router();
const User = require('../models/User');	
const passport = require('passport');
const CryptoJS = require('crypto-js');

const middleware = require('../../middleware');

router.get('/register', (req, res)=>{
	res.render('register');
});

router.post('/register', (req, res) => {
	var iv = CryptoJS.lib.WordArray.random(32).toString();
	User.register(new User({
        username: req.body.username,
        name: req.body.name, 
        email: req.body.email, 
		privateKey: CryptoJS.AES.encrypt(req.body.privateKey, req.body.privateKey, {iv: iv}).toString(),
		iv: iv
    }), req.body.password, (err, user) => {
		if(err){
            console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		} else {
			passport.authenticate("local")(req, res, () => {
                // console.log(user.username);
				req.flash('success', "Welcome to PassShield " + user.username);
				res.redirect('/contents')
			});
		}
	});
});

router.get('/login', (req, res)=>{
	res.render('login', {page: 'login'});
});

router.post('/login', (req, res, next) => {
	passport.authenticate("local", {
		successFlash: "Welcome to PassShield, " + req.body.username + "!",
		successRedirect: "/contents", 
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res);
});

router.get('/logout', (req, res)=>{
    req.logout((err) => {
        if (err) { 
            return next(err); 
        } else {
            req.flash("success", "Successfully Logged you out");
            res.redirect('/login');
			req.session.validKey = false;
        }
    });
});

module.exports = router;