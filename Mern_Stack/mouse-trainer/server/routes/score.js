const router = require('express').Router();
const Score = require('../models/Score');

router.post('/', async (req, res) => {
  const { username, score, difficulty } = req.body;
  const saved = await Score.create({ username, score, difficulty });
  res.json(saved);
});

// Get top scores
router.get('/:difficulty', async (req, res) => {
  const scores = await Score.find({ difficulty: req.params.difficulty })
    .sort({ score: -1 })
    .limit(10); // Top 10

  res.json(scores);
});


module.exports = router;
