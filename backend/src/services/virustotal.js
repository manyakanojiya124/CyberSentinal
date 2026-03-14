const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');
const { virustotalApiKey } = require('../config');

async function getFileSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function getAnalysisByHash(sha256) {
  const response = await axios.get(
    `https://www.virustotal.com/api/v3/files/${sha256}`,
    {
      headers: { 'x-apikey': virustotalApiKey },
    }
  );
  return response.data.data.attributes.last_analysis_results || response.data.data.attributes;
}

async function scanFileWithVirusTotal(filePath) {
  // Step 1: Upload file to VirusTotal
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  try {
    const uploadResponse = await axios.post(
      'https://www.virustotal.com/api/v3/files',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'x-apikey': virustotalApiKey,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    const analysisId = uploadResponse.data.data.id;
    // Step 2: Poll for analysis result (longer wait, more attempts)
    let analysisResult = null;
    for (let i = 0; i < 20; i++) { // 20 attempts
      const resultResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': virustotalApiKey },
        }
      );
      if (resultResponse.data.data.attributes.status === 'completed') {
        analysisResult = resultResponse.data.data.attributes.results;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
    }
    if (!analysisResult) {
      // Try to fetch by hash as a fallback
      const sha256 = await getFileSha256(filePath);
      return await getAnalysisByHash(sha256);
    }
    return analysisResult;
  } catch (err) {
    // Handle 409 error: file already exists
    if (err.response && err.response.status === 409) {
      const sha256 = await getFileSha256(filePath);
      return await getAnalysisByHash(sha256);
    }
    throw err;
  }
}

async function scanUrlWithVirusTotal(url) {
  try {
    // Step 1: Submit URL for analysis
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url }),
      {
        headers: {
          'x-apikey': virustotalApiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const analysisId = submitResponse.data.data.id;

    // Step 2: Poll for analysis result
    let analysisResult = null;
    for (let i = 0; i < 20; i++) {
      const resultResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': virustotalApiKey },
        }
      );
      if (resultResponse.data.data.attributes.status === 'completed') {
        analysisResult = resultResponse.data.data.attributes.results;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
    }
    return analysisResult || { status: 'pending', message: 'Analysis not completed in time.' };
  } catch (err) {
    throw err;
  }
}

module.exports = { scanFileWithVirusTotal, scanUrlWithVirusTotal }; 