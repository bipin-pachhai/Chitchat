/**
 * Middleware that will restore login state from a session.
 *
 * Web applications typically use sessions to maintain login state between
 * requests.  For example, a user will authenticate by entering credentials into
 * a form which is submitted to the server.  If the credentials are valid, a
 * login session is established by setting a cookie containing a session
 * identifier in the user's web browser.  The web browser will send this cookie
 * in subsequent requests to the server, allowing a session to be maintained.
 *
 * If sessions are being utilized, and a login session has been established,
 * this middleware will populate `req.user` with the current user.
**/
var passport = require('passport');
var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done){
		User.findById(id, (err, user)=>{
			done(err, user);
		})
	});
}
//Using a local strategy to authenticate the user
//Note: though passport-local authenticate using default i.e username, we have provided email as options to authenticate using email address..
passport.use( new LocalStrategy({ usernameField: 'email' }, function(email, password, next){
	User.findOne({email: email }, (err, user)=>{
		if(err) {return next(err);}
		if(!user){ return next(null, false, {message: 'No user found!!'});}
		// if no error occurs while finding and user exist we check password
		user.checkPassword(password, (err, hasMatched)=>{
			if(err){return next(err);}
			if(hasMatched){
				
				return next(null, user);

			}
			else{
				return next(null, false, {message: 'Invalid Password!!'});
			}

		});
	});

	


}));

