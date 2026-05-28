const express = require('express');
const router = express.Router();
const { preview, send, getDefaultTemplate } = require('../controllers/emailCampaign.controller');

// GET /api/email-campaign/template  – fetch default template
router.get('/template', getDefaultTemplate);

// POST /api/email-campaign/preview  – render template for one recipient, no email sent
router.post('/preview', preview);

// POST /api/email-campaign/send  – send to all recipients
router.post('/send', send);

module.exports = router;
