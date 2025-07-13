require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error', err));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3000, () => console.log('Server running on http://localhost:3000/graphql'));

