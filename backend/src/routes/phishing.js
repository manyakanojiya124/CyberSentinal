// backend/src/routes/phishing.js
const express = require('express');
const { scanUrlWithVirusTotal } = require('../services/virustotal');
const mongoose = require('mongoose');
const ScanHistory = require('../models/ScanHistory');

const router = express.Router();

// POST /api/phishing/scan
router.post('/scan', async (req, res) => {
  const { url } = req.body;
  const userId = req.body.userId;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const result = await scanUrlWithVirusTotal(url);
    await ScanHistory.create({
  userId,
  type: 'phishing',
  input: url,
  result
});


    if (userId) {
      const User = require('../models/User');

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      await User.findByIdAndUpdate(userId, {
        $inc: {
          'linkVisits.today': 1,
          'linkVisits.thisWeek': 1,
          'linkVisits.thisMonth': 1,
        },
        $push: {
          linkHistory: {
            url,
            status: getSummaryStatus(result),
            time: new Date().toISOString(),
          },
        },
      });
    }

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Phishing scan failed', details: err.message });
  }
});

function getSummaryStatus(result) {
  const summary = Object.values(result || {}).filter(
    (r) => r.result && !['clean', 'undetected', 'unrated'].includes(r.result)
  );
  return summary.length > 0 ? 'Malicious' : 'Safe';
}

// GET /api/phishing/history
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId;

const scans = await ScanHistory.find({
  userId,
  type: 'phishing'
})

      .sort({ scannedAt: -1 })
      .limit(10)
      .lean();
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch scan history' });
  }
});

module.exports = router; 