const router = require('express').Router();
const { getAll, markRead, markAllRead, getUnreadCount } = require('../controllers/notifications.controller');

router.get('/', getAll);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markRead);
router.put('/mark-all-read', markAllRead);

module.exports = router;
