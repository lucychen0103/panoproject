const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const path = require('path');

const router = express.Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
);

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');
            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              // console.log(req.cookies);
              if (error) return next(error);
              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');
              // res.cookie('auth', token, { maxAge: 900000, httpOnly: true })
              // res.header('Authorization', 'Bearer ' + token);
              // console.log("res.headers");
              req.headers.authorization = "Bearer " + token;
              res.cookie('authorization',token, { maxAge: 900000, httpOnly: true });
              console.log("req.headers");
              console.log(req.headers);
              // console.log("req.user.authenticated");
              // console.log(req.user.authenticated);       
              // console.log(req.headers.authorization);
              res.redirect('/user/profile');
              // res.json({token: "Bearer " + token});   
              // return res.redirect('/user/profile');     
            }
          );
        } catch (error) {
          console.log("here in error")
          return next(error);
        }
      }
    )(req, res, next);
  }
);

router.get("/login", (req,res) => {
  console.log("here3");
      // res.sendFile('./login.html');
      // let connect_sid = req.header('Cookie');
      // var sessionCookie = pano.session.find({"_id" : ObjectId(req.session.cookie)}); // explicit
      // var cookie = cookie.parse(sessionCookie);

      // if (reqcookie == null) {
      //   res.sendFile(path.join(__dirname + '/public/login.html'));
      // } else {
      //   res.redirect("/profile");
      // }
      // if (moment().isAfter(cookie.Expires)){
      //   res.cookie('auth',token, { maxAge: 900000, httpOnly: true })
      // } else if (setCookie!= null && !moment().isAfter(cookie.Expires)) {
      //   res.sendFile(path.join(__dirname + '/public/login.html'));
      // }

    // }
});

router.get("/login", (req,res) => {
  let connect_sid = req.header('Cookie');
   // var sessionCookie = pano.sessions.find({"_id" : ObjectId(req.session.cookie)});
     // var cookie = cookie.parse(sessionCookie);
  console.log(req.headers);
  console.log(connect_sid);
  // console.log(pano.sessions.find());
  // console.log(sessionCookie);
  // console.log(cookie);
  if (!connect_sid){
      res.sendFile(path.join(__dirname + '/public/login.html'));
    }
  else {
    res.redirect("/user/profile");
  }
});


router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});




module.exports = router;