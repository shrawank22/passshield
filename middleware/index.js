var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isNotAuthenticated()){
        return next();
    }
	req.flassh("error", "You need to be logged in to view this page");
    res.redirect('/login');
}

module.exports = middlewareObj;