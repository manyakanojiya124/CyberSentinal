// backend/src/routes/threat.js
const express = require('express');
const router = express.Router();

// POST /api/threat/report
router.post('/report', (req, res) => {
  // TODO: Store user-reported threats
  res.json({ status: 'Threat report placeholder' });
});

module.exports = router; 