var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://ecapati:ecapati@ds021895.mlab.com:21895/carloswindow');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//var http = require('http');

app.set('port', process.env.PORT || 8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'carloswindow'}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

/*
app.use(session({
    secret: "cookie_secret",
    name: "cookie_name",
    store: "sessionStore", // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
*/

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

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

var listener = app.listen(app.get('port'), function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});

module.exports = app;
