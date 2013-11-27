/**
 * Module dependencies.
 */
var express  = require('express'),
    fs       = require('fs'),
    passport = require('passport'),
    logger   = require('mean-logger')
    colors   = require('colors');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env      = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config   = require('./config/config'),
    auth     = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connection.on("open", function(ref) {
  return console.log('Exponential: ' + 'Connected to MongoDB'.green);
});

mongoose.connection.on("error", function(err) {
  console.log('Exponential: ' + 'Failed to connect to MongoDB'.red);
  return console.log(err.message.red);
});

try {
  var db = mongoose.connect(config.db);
} catch(err) {
  // This catch block is never executed. Why?
  console.log('Exponential: ' + err.message.red);
}

// Load DB models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// bootstrap passport config
require('./config/passport')(passport);

var app = express();

// express settings
require('./config/express')(app, passport, db);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);

var startMessage = 'App started on port ' + port;
console.log('Exponential: ' + startMessage.green);

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
exports = module.exports = app;

