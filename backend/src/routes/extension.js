// backend/src/routes/extension.js
const express = require('express');
const router = express.Router();

// GET /api/extension/ping
router.get('/ping', (req, res) => {
  res.json({ status: 'Extension endpoint placeholder' });
});

module.exports = router; 