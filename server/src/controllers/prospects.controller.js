const db = require('../config/db');
const { notifyOwner } = require('../services/email.service');

async function getAll(req, res, next) {
  try {
    const { status, source, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
    if (source) { params.push(source); conditions.push(`source = $${params.length}`); }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const [data, count] = await Promise.all([
      db.query(
        `SELECT * FROM prospects ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      ),
      db.query(`SELECT COUNT(*) FROM prospects ${where}`, params.slice(0, -2)),
    ]);

    res.json({
      data: data.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM prospects WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Prospect not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, email, phone, source = 'website', service_interest, message, metadata } = req.body;
    const result = await db.query(
      `INSERT INTO prospects (name, email, phone, source, service_interest, message, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, phone, source, service_interest, message, JSON.stringify(metadata || {})]
    );
    const prospect = result.rows[0];

    // Create notification
    await db.query(
      `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
      [
        'new_lead',
        `New prospect: ${name || email}`,
        `Source: ${source} | Interest: ${service_interest || 'N/A'}`,
        JSON.stringify({ prospect_id: prospect.id }),
      ]
    );

    // Email owner
    notifyOwner({ type: 'new_lead', prospect }).catch(console.error);

    res.status(201).json(prospect);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const allowed = ['name', 'email', 'phone', 'status', 'service_interest', 'message', 'metadata'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        params.push(req.body[key]);
        updates.push(`${key} = $${params.length}`);
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'No valid fields to update' });

    params.push(req.params.id);
    const result = await db.query(
      `UPDATE prospects SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Prospect not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
}

async function getConversations(req, res, next) {
  try {
    const result = await db.query(
      `SELECT c.*,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count
       FROM conversations c WHERE c.prospect_id = $1 ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, getConversations };
