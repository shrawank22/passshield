var middlewareObj = {};
const Content = require('../src/models/Content');

middlewareObj.promptForKey = (req, res, next) => {
    if (req.isAuthenticated()) { 
        if (req.session.validKey && req.session.expectedKey) {
            return next();
        } else {
            res.render('keyPrompt');
        }
    } else {
        req.flash('error', 'You need to be logged in to view this page');
        res.redirect('/login');
    }
}

middlewareObj.checkCredentialOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Content.findById(req.params.id).then(content => {
            if (!content) {
                req.flash("error", 'Sorry, that content does not exist!');
                res.redirect('back');
            } else {
                if (content.owner.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You are not allowed to do that');
                    res.redirect('back');
                }
            }
        }).catch(err => {
          req.flash('error', 'An error occurred while retrieving the content');
          res.redirect('back');
        });
    } else {
      req.flash('error', 'You need to be logged in to view this page');
      res.redirect('/login');
    }
}
  


middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to view this page");
    res.redirect('/login');
}

module.exports = middlewareObj;