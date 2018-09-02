var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var newsletter = require('./routes/newsletter');

var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname+ '/node_modules/bootstrap/dist/css'));

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Connect-Flash Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Define Routes
app.use('/', routes);
app.use('/users', users);
// app.use('/newsletter', newsletter);



app.get('/newsletter', function(req, res) {
  res.render('newsletter');
});

app.post('/newsletter', function(req, res) {
  var email = req.body.email;

  req.checkBody('email', 'Please use a valid email address').isEmail();

  // Check for errors
  var errors = req.validationErrors();

  if(errors){
    console.log('Form has errors...');
    res.render('newsletter', {
      errors: errors,
      email: email,
    });
  } else {
    'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'brijy123@gmail.com',
      pass: 'xwleohcpoxxabqdy'
  }
});

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'brijy123@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Newsletter Subscription', // Subject line
        text: 'Thank you for Subscription.', // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        req.flash('success', 'You successfully subscribed');
        res.redirect('/newsletter');

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
  }
  console.log(email);
});

app.listen(3000);
console.log('Server started on port 3000');


