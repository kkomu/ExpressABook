var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer')

var routes = require('./routes/index');

// Load module logregdb
var db = require('./modules/allmongo');

// Load module express-session
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// express-session setup
app.use(session({secret: '123x456y789', resave: false, saveUninitialized: true}));

// multer setup
app.use(multer({ dest: './pictures/'}))

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/register', routes);
app.use('/addContact', routes);
app.use('/registerUser', db.registerUser);
app.use('/login', db.login);
app.use('/saveContact', db.saveContact);
app.use('/contacts', db.contacts);
app.use('/logout', db.logout);
app.use('/editContact', db.editContact);
app.use('/deleteContact', db.deleteContact);
//app.use('/contactInfo', db.contactInfo);
app.use('/showImage', db.showImage);

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

module.exports = app;
