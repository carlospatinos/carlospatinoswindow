var express = require('express');
//var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('client-sessions');
var bodyParser = require('body-parser');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://ecapati:ecapati@ds021895.mlab.com:21895/carloswindow');

var routes = require('./routes/index');
var attributes = require('./routes/attributes');
var profiles = require('./routes/profiles');

var app = express();

//var http = require('http');

app.set('port', process.env.PORT || 8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 30 * 60 * 1000,
}));


app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});



app.use(function(req,res,next){
    req.db = db;
    next();
});

function requireLogin(req, res, next) {
  console.log(req.session);
  if (req.session && req.session.signum) {
    console.log("==> Session exist")
    next(); // allow the next route to run
  } else {
    // require the user to log in
    console.log("==> Session null");
    req.session.reset();
    res.redirect("/login"); // or render a form, etc.
  }
}

app.all("/attributes/*", requireLogin, function(req, res, next) {
  next(); // if the middleware allowed us to get here,
          // just move on to the next route handler
});

app.all("/profiles/*", requireLogin, function(req, res, next) {
  next(); // if the middleware allowed us to get here,
          // just move on to the next route handler
});

app.all("/", requireLogin, function(req, res, next) {
  next(); // if the middleware allowed us to get here,
          // just move on to the next route handler
});

app.use('/', routes);
app.use('/attributes', attributes);
app.use('/profiles', profiles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//app.listen(app.get('port'));

//http.createServer(app).listen(app.get('port'),
  //function(){
    //console.log("Express server listening on port " + app.get('port'));
//});

var server  = app.listen(app.get('port'), '0.0.0.0', function(){
    //console.log('Listening on port ' + server .address().port); //Listening on port 8888
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
});

module.exports = app;
