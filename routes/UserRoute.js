const urouter = require('express').Router()
const { reg, login, update, get, remove, user, stats } = require('../controllers/UserController')
const auth = require('../middlewares/auth');

urouter.post('/register', reg);

urouter.post('/login', login);

urouter.patch('/:_id', auth, update);

urouter.get('/details/:_id', auth, get);

urouter.get('/', auth, user);

urouter.get('/stats', auth, stats);

urouter.delete('/:_id', auth, remove);

module.exports = { urouter }