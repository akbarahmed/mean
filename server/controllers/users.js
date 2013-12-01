/**
 * @file Authentication (login and signup) for users
 * @module controllers/users 
 */
var mongoose = require('mongoose');

var User = mongoose.model('User');

/** Auth callback */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/** Show login form */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/** Show sign up form */
exports.signup = function(req, res) {
    res.render('users/signup', {
        // both uses of title work
        title: 'Sign up',
        user: new User()
        //helpers: {
        //    title: function() { return 'Signup'; }
        //}
    });
};

/** Logout */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/** Redirect after successful authentication */
exports.session = function(req, res) {
    res.redirect('/');
};

/** Create user */
exports.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/** Show profile */
exports.show = function(req, res) {
    var user = req.profile;

    res.render('users/show', {
        title: user.name,
        user: user
    });
};

/** Send User */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/** Find user by id */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

