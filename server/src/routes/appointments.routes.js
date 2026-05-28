const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAll, create, updateStatus, getSlots, getAvailableDatesHandler } = require('../controllers/appointments.controller');

router.get('/slots/:date', getSlots);
router.get('/available-dates', getAvailableDatesHandler);
router.post('/', create); // public – anyone can book
router.get('/', auth, getAll);
router.put('/:id/status', auth, updateStatus);

module.exports = router;
