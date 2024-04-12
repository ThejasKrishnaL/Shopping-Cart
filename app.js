var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine: hbs } = require("express-handlebars")
var db = require('./config/connection')
var session = require('express-session')



var fileUpload = require('express-fileupload')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var handlebars = require('handlebars')
const template = handlebars.compile("{{aString.trim}}");
const result = template(
  { aString: "  abc  " },
  {
    allowedProtoMethods: {
      trim: true
    }
  }
);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }));
app.use(fileUpload())
app.use(logger('dev'));

app.post('/', function (request, response) {
  console.log(request.body);
  response.send(request.body);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err) => {
  if (err) console.log("Connection Error " + err);
  else console.log("Database Connected to 27017");

})

app.use(session({secret:"Key",cookie:{maxAge:6000000}}))
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
