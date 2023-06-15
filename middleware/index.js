var middlewareObj = {};
const Content = require('../src/models/Content'); 

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isNotAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to view this page");
    res.redirect('/login');
}

module.exports = middlewareObj;
