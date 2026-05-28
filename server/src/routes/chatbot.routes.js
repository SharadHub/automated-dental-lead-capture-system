const router = require('express').Router();
const { chat } = require('../services/chatbot.service');

router.post('/message', async (req, res, next) => {
  try {
    const { session_id, message } = req.body;
    if (!session_id || !message?.trim()) {
      return res.status(400).json({ error: 'session_id and message are required' });
    }
    const result = await chat(session_id, message.trim().slice(0, 2000));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
