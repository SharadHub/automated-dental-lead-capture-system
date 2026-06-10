const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use('/auth', require('./auth.routes'));
router.use('/prospects', auth, require('./prospects.routes'));
router.use('/appointments', require('./appointments.routes'));
router.use('/analytics', auth, require('./analytics.routes'));

module.exports = router;
