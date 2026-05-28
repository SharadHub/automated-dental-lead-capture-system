const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use('/auth', require('./auth.routes'));
router.use('/prospects', auth, require('./prospects.routes'));
router.use('/appointments', require('./appointments.routes'));
router.use('/analytics', auth, require('./analytics.routes'));
router.use('/notifications', auth, require('./notifications.routes'));
router.use('/chatbot', require('./chatbot.routes'));
router.use('/webhooks', require('./webhooks.routes'));
router.use('/email-campaign', auth, require('./emailCampaign.routes'));

module.exports = router;
