const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const session = require('express-session')
const UserModel = require('./model/model');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/pano');
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


// function ProfileRouter(req, res, next) {
//   res.redirect('/user/profile');
//   next();
// }

// app.use(
//       "/profile", function (req, res, next) {
//         console.log("here in app.use profile");
//         // console.log(req.headers);
//         res.set('Authorization', `Bearer ` + req.cookies["authentication"]);
//         // req.headers.authorization = `Bearer ` + req.cookies["authentication"];
//         next();
//       },
//       ProfileRouter
//     );

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);


// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3000, () => {
  console.log('Server started.')
});

connection.on('connected', function () {
  console.log(`STATE: `, connection.readyState);
  console.log('connected');
  console.log('Mongoose default connection open to ' );
});

// var getCookies = function(request) {
//   var cookies = {};
//   request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
//     var parts = cookie.match(/(.*?)=(.*)$/)
//     cookies[ parts[1].trim() ] = (parts[2] || '').trim();
//   });
//   return cookies;
// };

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    //secret: process.env.SECRET,
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 30
    }
}));

//maybe
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(request, response) {
   response.sendFile(path.join(__dirname + '/home.html'));
});

