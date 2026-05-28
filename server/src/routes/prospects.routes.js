const router = require('express').Router();
const { getAll, getOne, create, update, getConversations } = require('../controllers/prospects.controller');

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);
router.get('/:id/conversations', getConversations);

module.exports = router;
