require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runSeeds() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, '001_seed.sql'), 'utf8');
    await client.query(sql);
    console.log('Seeds ran successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();
