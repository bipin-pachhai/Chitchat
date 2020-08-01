//var passport = require('passport');
module.exports ={
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		  req.flash('info', 'Please log in to view that resource');
          res.redirect('/login');

	}
}// end of module exports