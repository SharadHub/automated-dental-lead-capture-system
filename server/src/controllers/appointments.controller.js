const db = require('../config/db');
const { isSlotAvailable, getAvailableSlots, getAvailableDates } = require('../services/calendar.service');
const { notifyOwner, sendAppointmentConfirmation } = require('../services/email.service');

async function getAll(req, res, next) {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (status) { params.push(status); conditions.push(`a.status = $${params.length}`); }
    if (date) { params.push(date); conditions.push(`a.appointment_date = $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const result = await db.query(
      `SELECT a.*, p.name as prospect_name, p.email as prospect_email, p.phone as prospect_phone
       FROM appointments a LEFT JOIN prospects p ON a.prospect_id = p.id
       ${where} ORDER BY a.appointment_date ASC, a.appointment_time ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const count = await db.query(
      `SELECT COUNT(*) FROM appointments a ${where}`,
      params.slice(0, -2)
    );

    res.json({ data: result.rows, total: parseInt(count.rows[0].count), page: parseInt(page) });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { prospect_id, appointment_date, appointment_time, service, dentist, notes } = req.body;

    const available = await isSlotAvailable(appointment_date, appointment_time);
    if (!available) {
      return res.status(409).json({ error: 'This time slot is not available. Please choose another.' });
    }

    const result = await db.query(
      `INSERT INTO appointments (prospect_id, appointment_date, appointment_time, service, dentist, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [prospect_id, appointment_date, appointment_time, service, dentist, notes]
    );
    const appointment = result.rows[0];

    // Update prospect status to 'lead'
    await db.query(
      `UPDATE prospects SET status = 'lead' WHERE id = $1 AND status = 'prospect'`,
      [prospect_id]
    );

    // Get prospect info
    const prospectResult = await db.query('SELECT * FROM prospects WHERE id = $1', [prospect_id]);
    const prospect = prospectResult.rows[0];

    // Notify owner + send confirmation email
    notifyOwner({ type: 'appointment_booked', prospect, appointment }).catch(console.error);
    sendAppointmentConfirmation(prospect, appointment).catch(console.error);

    // Create notification
    await db.query(
      `INSERT INTO notifications (type, title, body, data) VALUES ($1, $2, $3, $4)`,
      [
        'appointment_booked',
        `Appointment booked: ${prospect?.name || 'Unknown'}`,
        `${service} on ${appointment_date} at ${appointment_time}`,
        JSON.stringify({ appointment_id: appointment.id, prospect_id }),
      ]
    );

    res.status(201).json(appointment);
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await db.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Appointment not found' });

    // If completed, upgrade prospect to 'patient'
    if (status === 'completed') {
      await db.query(
        'UPDATE prospects SET status = $1 WHERE id = $2',
        ['patient', result.rows[0].prospect_id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) { next(err); }
}

async function getSlots(req, res, next) {
  try {
    const { date } = req.params;
    const slots = await getAvailableSlots(date);
    res.json({ date, slots });
  } catch (err) { next(err); }
}

async function getAvailableDatesHandler(req, res, next) {
  try {
    const dates = await getAvailableDates(new Date(), 14);
    res.json(dates);
  } catch (err) { next(err); }
}

module.exports = { getAll, create, updateStatus, getSlots, getAvailableDatesHandler };
