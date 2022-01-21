const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ email, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }
        console.log("in auth.js passport login");
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// passport.use(
//   new JWTstrategy(
//     {
//       secretOrKey: 'TOP_SECRET',
//       // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       // ExtractJwt.fromAuthHeaderWithScheme('jwt')
//       // jwtFromRequest: req => req.cookies.auth,
//     },
//     async (token, done) => {
//       try {
//         console.log("req.cookies.auth");
//         console.log(req.cookies.auth);
//         return done(null, token.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

var jwtOptions = {

    // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
    // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
    secretOrKey: 'TOP_SECRET'
    //issuer: config.jwt.issuer,
    //audience: config.jwt.audience,
};

// passport.use(new JWTstrategy(jwtOptions, (jwt_payload, done) => {
//   console.log("in passport use auth.js");

//     UserModel.findOne({id: jwt_payload.id}, (err, user) => {

//         if (err) {
//             return done(err, false);
//         }

//         if (!user) {
//             return done(null, false);
//         }

//         return done(null, user);

//     });

// }));

passport.use(new JWTstrategy(jwtOptions, (jwt_payload, done) => {
  console.log("here in auth.js passport.use new jwt");

    UserModel.findOne({id: jwt_payload.id}, (err, user) => {

        if (err) {
            return done(err, false);
        }

        if (!user) {
            return done(null, false);
        }

        return done(null, user);

    });

}));

// passport.use(
//   new JWTstrategy(
//     {
//       secretOrKey: 'TOP_SECRET',
//       jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
//     },
//     async (token, done) => {
//       try {
//         return done(null, token.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );