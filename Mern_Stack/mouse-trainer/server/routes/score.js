const router = require('express').Router();
const Score = require('../models/Score');

router.post('/', async (req, res) => {
  const { username, score, difficulty } = req.body;
  const saved = await Score.create({ username, score, difficulty });
  res.json(saved);
});

module.exports = router;
