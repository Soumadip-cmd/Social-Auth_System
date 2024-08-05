require('dotenv').config()
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./models/Users");



const JWT_SECRET = "kufychmchmkdyikyh";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID=process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET=process.env.FACEBOOK_APP_SECRET;



//google
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          await user.save();
        }

        const token = jwt.sign(
          {
            id: user.id,
          },
          JWT_SECRET,
          { expiresIn: `1h` }
        );
        return done(null, { user, token });
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);


//facebook
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = new User({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
      });

      await user.save();
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      { expiresIn: `1h` }
    );
    return done(null, { user, token });
  } catch (error) {
    console.error(error);
    return done(error, null);
  }
}
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
