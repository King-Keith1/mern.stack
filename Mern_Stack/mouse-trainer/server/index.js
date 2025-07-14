require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Add this line
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

// ✅ Enable CORS for all origins (safe for development)
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error', err));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3000, () => console.log('Server running on http://localhost:3000/graphql'));
