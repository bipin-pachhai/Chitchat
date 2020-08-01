var express = require('express');
var passport = require('passport');
var User = require('../models/users');
var Chat = require('../models/chats');
var router = express.Router();

router.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash('error');
	res.locals.infos = req.flash('info');
	next();
});

router.get('/', (req, res, next)=>{
	User.find().sort({ createdAt: "descending"}).exec((err, users)=>
	{
		if(err){return next(err);}
		res.render('index', {users: users});
	});

});
// for the signup page display
router.get('/signup', (req, res)=>{
   res.render('signup');
});
// for actual signup.. Here we authenticate the user with Local strategy
router.post('/signup',( req, res, next)=>{
	 var username = req.body.username;
	 var password = req.body.password;
	 var password2 = req.body.password2;
	 var email  = req.body.email;
	 
	 //var {name,username, email, password, password2} = req.body;
	 if(password!= password2){
	 	req.flash('error', "The password you provided didn't match.");
	 		return res.redirect('/signup');

	 }
     else{
	 User.findOne({email: email}, (err, user)=>{
	 	//if some error occurs while finding the user
	 	if(err){return next(err);}
	 	// if user already exists
	 	if(user){
	 		req.flash('error', "An User has already been registered under this email. Please Sign Up with a unique email address.");
	 		return res.redirect('/signup');

	 	}
       var newUser = new User({
       	email: email,
        username: username,
       	password: password
       });
       newUser.save(next);

	 });
	 }

     }, passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/signup',
                                   failureFlash: true }));

router.get('/users/:username', (req , res, next) =>{
	User.findOne({username: req.params.username}, (err, user)=>{
		if(err) {return next(err);}
		if(!user){
			return next(404);
		}
		// we pass the user object as the name user if found to render on profile.ejs
		res.render('profile', {user: user});
	});
    });
//when landed to the edit link
// const {ensureAuthenticated} = require('../config/auth');
router.get('/chat/:username', require('../config/auth').ensureAuthenticated, (req, res)=>{

	/* Chat.find({}).then(chat => {
      res.json(chat);
    });
    */
	res.render('chat', {username: req.params.username});
    });

//Send previous chats save on the database
router.get('/chats', require('../config/auth').ensureAuthenticated, (req, res)=>{
	Chat.find({}).then(chat => {
      res.json(chat);
  });
  });



// for login display page while landing on login page
router.get('/login',(req, res)=>{
     res.render('login');
  });
/*
**for actual login
//passport.authenticate returns a request handler function which we pass
// instead one we write ourselves. This lets us redirect to the right spot, depending
// on whether the user successfully logged in or not.
*/
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }) );

router.get('/logout',(req, res)=>{
	// logging out is easily handled with Passport. req.logout() is function
	// of passport which successfully logs out the user session
	//req.flash('success_messages', "Successfully logged out.")
	req.logout();
	req.flash('info', "Successfully logged out.")
	  
	res.redirect('/login');

});



module.exports = router;