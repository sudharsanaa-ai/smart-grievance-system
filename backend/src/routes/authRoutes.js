const express = require('express');
const { login } = require('../controllers/authController');

const { loginRules, validate } = require('../middleware/validatorMiddleware');

const router = express.Router();

router.post('/login', loginRules(), validate, login);

module.exports = router;
