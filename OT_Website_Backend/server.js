const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://yuanjiex:mynameisjeff123@otapp.dm9giid.mongodb.net/User_Activity?retryWrites=true&w=majority')
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use('/users', userRoutes);  

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});