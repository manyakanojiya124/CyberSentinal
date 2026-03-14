// backend/src/config/index.js
require('dotenv').config();

module.exports = {
  groqApiKey: process.env.GROQ_API_KEY,
  virustotalApiKey: process.env.VIRUSTOTAL_API_KEY,
  hibpApiKey: process.env.HIBP_API_KEY,
  postgresUri: process.env.POSTGRES_URI,
}; 