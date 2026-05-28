const db = require('../config/db');

// Generate all time slots for a given date based on clinic availability
async function getAvailableSlots(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  // Get clinic availability for this day
  const availability = await db.query(
    'SELECT * FROM availability WHERE day_of_week = $1 AND is_active = true',
    [dayOfWeek]
  );

  if (!availability.rows.length) return [];

  const { start_time, end_time, slot_duration_minutes } = availability.rows[0];

  // Generate all slots
  const slots = [];
  const [startH, startM] = start_time.split(':').map(Number);
  const [endH, endM] = end_time.split(':').map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  for (let m = startMins; m < endMins; m += slot_duration_minutes) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }

  // Remove booked slots
  const booked = await db.query(
    `SELECT appointment_time FROM appointments
     WHERE appointment_date = $1 AND status NOT IN ('cancelled')`,
    [dateStr]
  );

  const bookedTimes = booked.rows.map(r => r.appointment_time.slice(0, 5));
  return slots.filter(s => !bookedTimes.includes(s));
}

async function isSlotAvailable(dateStr, timeStr) {
  const available = await getAvailableSlots(dateStr);
  return available.includes(timeStr.slice(0, 5));
}

// Get next N available dates starting from today
async function getAvailableDates(fromDate = new Date(), count = 14) {
  const dates = [];
  const current = new Date(fromDate);

  while (dates.length < count) {
    const dateStr = current.toISOString().split('T')[0];
    const slots = await getAvailableSlots(dateStr);
    if (slots.length > 0) {
      dates.push({ date: dateStr, slotsCount: slots.length });
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

module.exports = { getAvailableSlots, isSlotAvailable, getAvailableDates };
