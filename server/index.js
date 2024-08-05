const express = require("express");
const path = require("path");
const connectToMongo = require("./Db");
const cors = require("cors");
const passport=require('passport')
const passportJs=require('./Passport')
const passportAuth=require('./Routes/Passport.auth')

const app = express();
connectToMongo();

const port = 8000;

app.use('/auth',passportAuth)

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(passport.initialize());





// Remove cookie-session and session middleware

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(require(path.join(__dirname, "Routes/auth.js")));


app.get("/test", (req, res) => {
  try {
    res.json({ Success: true, msg: "API is Working Properly.." });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ Success: false, msg: "API is not Working Properly.." });
  }
});

app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});
