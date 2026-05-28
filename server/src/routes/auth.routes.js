const router = require('express').Router();
const auth = require('../middleware/auth');
const { login, me, changePassword } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/me', auth, me);
router.put('/change-password', auth, changePassword);

module.exports = router;
