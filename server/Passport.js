require('dotenv').config()
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./models/Users");



const JWT_SECRET = "kufychmchmkdyikyh";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
          { expiresIn: 60 * 60 }
        );
        return done(null, { user, token });
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
