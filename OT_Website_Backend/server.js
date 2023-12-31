require('dotenv').config(); // This should be at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Since your MongoDB credentials and secret should be stored in .env, replace the strings with these:
const mongoDBURI = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

app.use(cors({
  origin: ['http://ot-website.s3-website-us-east-1.amazonaws.com/'], // Adjust the origin according to your frontend
  credentials: true // Allows cookies to be sent with requests
}));
app.use(express.json());

// Connect to MongoDB using the URI from environment variables
mongoose.connect(mongoDBURI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Session middleware configuration
app.use(session({
  secret: sessionSecret, // Use the session secret from environment variables
  resave: false,
  saveUninitialized: false, // Recommended for login sessions
  store: MongoStore.create({ 
    mongoUrl: mongoDBURI // Use the MongoDB URI from environment variables
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // Enforce HTTPS in production
    httpOnly: true, // Helps against XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use('/users', userRoutes);

app.listen(process.env.PORT || 5000, () => { // Use the PORT environment variable for flexibility
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
