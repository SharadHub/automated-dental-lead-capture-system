/**
 * Run this once to create the admin user:
 *   node setup-admin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setup() {
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash('password', 10);

    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES
        ('Clinic Owner',   'owner@dentalclinic.com',   $1, 'owner'),
        ('Manager',        'manager@dentalclinic.com', $1, 'manager')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [hash]);

    console.log('✅ Admin users created/updated:');
    console.log('   owner@dentalclinic.com   / password');
    console.log('   manager@dentalclinic.com / password');
    console.log('\n⚠️  Change the password after first login!');
  } catch (err) {
    console.error('❌ Failed:', err.message);
    console.error('   Make sure DATABASE_URL is set in server/.env and migrations have run.');
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
