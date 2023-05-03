const lrouter = require('express').Router()
const { create, remove, get } = require('../controllers/ListController')
const auth = require('../middlewares/auth');

lrouter.post('/create', auth, create);

lrouter.delete('/:_id', auth, remove);

lrouter.get('/', auth, get);

module.exports = { lrouter }