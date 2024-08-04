const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-jwt-secret"; // Use a secure key in production

const router = express.Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user.user,
      token: req.user.token,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});

router.get("/logout", (req, res) => {
  // Handle logout
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // Disable session management
    failureRedirect: "/auth/login/failed",
  }),
  (req, res) => {
    // Redirect to frontend with token in query params
    res.redirect(`http://localhost:3000/home?token=${req.user.token}`);
    const token = req.user.token;
    // res.json({
    //   success: true,
    //   message: "Authentication successful",
    //   token: token,
    // });
  }
);


module.exports = router;
