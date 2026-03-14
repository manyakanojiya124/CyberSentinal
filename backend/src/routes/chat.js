// backend/src/routes/chat.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getGroqChatResponse } = require('../services/groq');
const { scanUrlWithVirusTotal, scanFileWithVirusTotal } = require('../services/virustotal');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function extractUrl(text) {
  // Simple URL regex
  const urlRegex = /(https?:\/\/[\w\-\.\/?#&=;%:@!$'()*+,]+)|(www\.[\w\-\.\/?#&=;%:@!$'()*+,]+)/gi;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

function getStatusLabel(result) {
  if (!result) return { label: 'Unknown', emoji: '❓', color: 'gray' };
  const val = (result || '').toLowerCase();
  if (["clean", "harmless", "safe", "undetected", "unrated"].includes(val)) return { label: 'Safe', emoji: '✔️', color: 'green' };
  if (["phishing", "malicious", "malware", "suspicious"].includes(val)) return { label: result.charAt(0).toUpperCase() + result.slice(1), emoji: '❌', color: 'red' };
  return { label: result, emoji: '⚠️', color: 'yellow' };
}

async function formatVirusTotalResultWithAdvice(result, type = 'file', getGroqChatResponse, url = '') {
  if (!result || typeof result !== 'object') return 'No scan result.';
  const engines = Object.entries(result);
  if (!engines.length) return 'No scan result.';
  let flagged = [];
  let total = engines.length;
  for (const [engine, data] of engines) {
    if (data && data.result && !['clean', 'harmless', 'undetected', 'unrated', 'safe'].includes((data.result || '').toLowerCase())) {
      flagged.push({ engine, result: data.result, category: data.category });
    }
  }
  let verdict = '';
  let summary = '';
  if (flagged.length === 0) {
    verdict = `🟢 **Safe!**`;
    summary = `**0** / **${total}** Engines Flagged`;
  } else {
    verdict = flagged.length > 2 ? '🔴 **Malicious!**' : '🟠 **Suspicious!**';
    summary = `**${flagged.length}** / **${total}** Engines Flagged`;
  }
  let urlLine = url ? `**URL:**\n${url}` : '';
  // Table header
  let table = '\n| Engine | Status | Category |\n|:-------|:-------|:---------|\n';
  // Show up to 10 engines, prioritizing flagged, then safe
  const sorted = [...flagged, ...engines.filter(([engine, data]) => !flagged.find(f => f.engine === engine)).slice(0, 10 - flagged.length)]
    .slice(0, 10);
  for (const row of sorted) {
    const engine = row.engine || row[0];
    const data = row.result ? row : row[1];
    const status = getStatusLabel(data.result);
    const cat = (data.category || '').toLowerCase();
    table += `| **${engine}** | ${status.emoji} ${status.label} | ${data.category || '-'} |\n`;
  }
  if (engines.length > 10) table += `| ...and ${engines.length - 10} more | | |\n`;
  // Add prevention advice from Groq
  let advice = '';
  try {
    advice = await getGroqChatResponse(`A user uploaded a ${type}. ${flagged.length} engines flagged it as ${flagged.map(f=>f.result).join(', ')}. Give a short prevention tip in 1-2 lines in markdown, with a warning emoji.`);
  } catch {}
  if (advice) advice = `\n\n⚠️ **Prevention Tip:** ${advice}`;
  return `### ${verdict}\n${summary}\n${urlLine}\n${table}${advice}`;
}

// POST /api/chat
router.post('/', upload.single('file'), async (req, res) => {
  const { message } = req.body;
  const file = req.file;
  if (!message && !file) {
    return res.status(400).json({ error: 'No message or file provided' });
  }
  try {
    // 1. If file is uploaded, scan with VirusTotal
    if (file) {
      const filePath = path.resolve(file.path);
      const result = await scanFileWithVirusTotal(filePath);
      fs.unlink(filePath, () => {}); // Clean up
      const msg = await formatVirusTotalResultWithAdvice(result, 'file', getGroqChatResponse);
      return res.json({ message: msg });
    }
    // 2. If message contains a URL, scan with VirusTotal
    const url = message ? extractUrl(message) : null;
    if (url) {
      const result = await scanUrlWithVirusTotal(url);
      const msg = await formatVirusTotalResultWithAdvice(result, 'url', getGroqChatResponse, url);
      return res.json({ message: msg });
    }
    // 3. Otherwise, use Groq chat
    const response = await getGroqChatResponse(message);
    res.json({ message: response });
  } catch (err) {
    res.status(500).json({ error: 'Chatbot response failed', details: err.message });
  }
});

module.exports = router; 