const db = require('../config/db');

async function getOverview(req, res, next) {
  try {
    const [prospects, leads, patients, appointments, conversions] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM prospects WHERE status = 'prospect'`),
      db.query(`SELECT COUNT(*) FROM prospects WHERE status = 'lead'`),
      db.query(`SELECT COUNT(*) FROM prospects WHERE status = 'patient'`),
      db.query(`SELECT COUNT(*) FROM appointments WHERE status NOT IN ('cancelled')`),
      db.query(`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('lead','patient')) as converted,
          COUNT(*) as total
        FROM prospects
      `),
    ]);

    const convRate = conversions.rows[0];
    const conversionRate = convRate.total > 0
      ? ((convRate.converted / convRate.total) * 100).toFixed(1)
      : 0;

    res.json({
      prospects: parseInt(prospects.rows[0].count),
      leads: parseInt(leads.rows[0].count),
      patients: parseInt(patients.rows[0].count),
      appointments: parseInt(appointments.rows[0].count),
      conversionRate: parseFloat(conversionRate),
    });
  } catch (err) { next(err); }
}

async function getBySource(req, res, next) {
  try {
    const result = await db.query(`
      SELECT source, COUNT(*) as total,
        COUNT(*) FILTER (WHERE status IN ('lead','patient')) as converted
      FROM prospects GROUP BY source ORDER BY total DESC
    `);
    res.json(result.rows.map(r => ({
      source: r.source,
      total: parseInt(r.total),
      converted: parseInt(r.converted),
      rate: r.total > 0 ? ((r.converted / r.total) * 100).toFixed(1) : 0,
    })));
  } catch (err) { next(err); }
}

async function getTimeSeries(req, res, next) {
  try {
    const { days = 30 } = req.query;
    const result = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, source
      FROM prospects
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at), source
      ORDER BY date ASC
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
}

async function getAppointmentStats(req, res, next) {
  try {
    const result = await db.query(`
      SELECT status, COUNT(*) as count
      FROM appointments GROUP BY status
    `);
    const byService = await db.query(`
      SELECT service, COUNT(*) as count
      FROM appointments GROUP BY service ORDER BY count DESC
    `);
    res.json({
      byStatus: result.rows,
      byService: byService.rows,
    });
  } catch (err) { next(err); }
}

async function getRecentActivity(req, res, next) {
  try {
    const prospects = await db.query(
      'SELECT * FROM prospects ORDER BY created_at DESC LIMIT 5'
    );
    const appointments = await db.query(`
      SELECT a.*, p.name as prospect_name FROM appointments a
      LEFT JOIN prospects p ON a.prospect_id = p.id
      ORDER BY a.created_at DESC LIMIT 5
    `);
    const notifications = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10'
    );
    res.json({
      recentProspects: prospects.rows,
      recentAppointments: appointments.rows,
      notifications: notifications.rows,
    });
  } catch (err) { next(err); }
}

module.exports = { getOverview, getBySource, getTimeSeries, getAppointmentStats, getRecentActivity };
