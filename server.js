/**
 * @file Express server startup file
 */

var express  = require('express'),
    fs       = require('fs'),
    passport = require('passport'),
    logger   = require('mean-logger')
    colors   = require('colors');

// Important: The order of loading is important

// Load configurations
// if test env, load example file
var env      = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config   = require('./config/config'),
    auth     = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

// Project directories
var dirRoot         = __dirname,
    dirServer       = dirRoot + '/server',
    dirServerModels = dirServer + '/models',
    dirServerRoutes = dirServer + '/routers',
    dirClient       = dirRoot + '/client';

// Connect to MongoDB
mongoose.connection.on("open", function(ref) {
  return console.log('Exponential: '.blue + 'Connected to MongoDB'.green);
});

mongoose.connection.on("error", function(err) {
  console.log('Exponential: '.blue + 'Failed to connect to MongoDB'.red);
  return console.log(err.message.red);
});

try {
  var db = mongoose.connect(config.db);
} catch(err) {
  // This catch block is never executed. Why?
  console.log('Exponential: ' + err.message.red);
}

// Load Mongoose models
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

// Load all Express routes
var loadRoutes = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var routerPath = path + '/' + file;
    var stat = fs.statSync(routerPath);
      if (stat.isFile()) {
        if (/(.*)\.(js$)/.test(file)) {
          console.log('Exponential: '.blue + 'Loading router '.green + routerPath.green);
          require(routerPath)(app, passport, auth);
        }
      } else if (stat.isDirectory()) {
        loadRoutes(routerPath);
      }
    });
};
loadRoutes(dirServerRoutes);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);

var startMessage = 'App started on port ' + port;
console.log('Exponential: '.blue + startMessage.green);

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
exports = module.exports = app;

