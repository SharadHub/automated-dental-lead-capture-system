const db = require('../config/db');

async function getAll(req, res, next) {
  try {
    const result = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    await db.query('UPDATE notifications SET read = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function markAllRead(req, res, next) {
  try {
    await db.query('UPDATE notifications SET read = true WHERE read = false');
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function getUnreadCount(req, res, next) {
  try {
    const result = await db.query('SELECT COUNT(*) FROM notifications WHERE read = false');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) { next(err); }
}

module.exports = { getAll, markRead, markAllRead, getUnreadCount };
