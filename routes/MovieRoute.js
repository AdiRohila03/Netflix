const mrouter = require('express').Router()
const { create, update, remove, get, random, all } = require('../controllers/MovieController')
const auth = require('../middlewares/auth');

mrouter.post('/create', auth, create);

mrouter.patch('/:_id', auth, update);

mrouter.delete('/:_id', auth, remove);

mrouter.get('/find/:_id', auth, get);

mrouter.get('/random', auth, random);

mrouter.get('/all', auth, all);

module.exports = { mrouter }