// backend/src/db.js
const { Pool } = require('pg');
const { postgresUri } = require('./config');

const pool = new Pool({
  connectionString: postgresUri,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});
// Helper to insert a scan record
db = {
  async saveScan({ type, input, result }) {
    return pool.query(
      'INSERT INTO scan_history (type, input, result, scanned_at) VALUES ($1, $2, $3, NOW())',
      [type, input, JSON.stringify(result)]
    );
  },
  async getRecentScans(limit = 10) {
    const res = await pool.query(
      'SELECT * FROM scan_history ORDER BY scanned_at DESC LIMIT $1',
      [limit]
    );
    return res.rows;
  },
};

module.exports = { pool, db }; 
