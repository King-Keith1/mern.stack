const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  difficulty: String,
});

module.exports = mongoose.model('Score', ScoreSchema);
