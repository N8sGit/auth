'use strict';

var app = require('express')();
var path = require('path');

const session = require('express-session')

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));


app.use(session({
  secret: 'abracadabra',
  resave: false,
  saveUninitialized: false
}));




app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});



// "Responding" middleware (may send a response back to client)

app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));






module.exports = app;
