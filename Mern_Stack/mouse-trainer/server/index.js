const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth & Score Routes (you'll build next)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/score', require('./routes/score'));

app.listen(3000, () => console.log('Server running on port 3000'));
