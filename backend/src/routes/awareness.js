// backend/src/routes/awareness.js
const express = require('express');
const router = express.Router();

// GET /api/awareness/scenario
router.get('/scenario', (req, res) => {
  // TODO: Serve scam scenarios
  res.json({ scenario: 'Awareness scenario placeholder' });
});

module.exports = router; 