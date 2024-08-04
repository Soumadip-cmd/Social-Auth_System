const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./models/Users');



const JWT_SECRET = "ycykicykckckyct"; // Environment variable for JWT secret
const GOOGLE_CLIENT_ID = "  "; // Google Client ID from environment variable
const GOOGLE_CLIENT_SECRET = "  "; // Google Client Secret from environment variable

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email'], // Requesting user's profile and email
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract the user's email from the Google profile
      const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

      if (!email) {
        return done(new Error('Email not found'), null);
      }

      // Find or create the user in the database
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          name: profile.displayName,
          email: email, // Use the email retrieved from the profile
          googleId: profile.id
        });
        await user.save();
      }

      // Create a JWT token with user details
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

      // Pass the user and token to the done function
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error, null);
    }
  }
));

// Serialize user instance to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
