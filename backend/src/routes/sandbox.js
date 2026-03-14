// backend/src/routes/sandbox.js
const express = require('express');
const router = express.Router();

// POST /api/sandbox/simulate
router.post('/simulate', (req, res) => {
  // TODO: Simulate file/link behavior
  res.json({ result: 'Sandbox simulation placeholder' });
});

module.exports = router; 