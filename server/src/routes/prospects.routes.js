const router = require('express').Router();
const { getAll, getOne, create, update } = require('../controllers/prospects.controller');

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);

module.exports = router;
