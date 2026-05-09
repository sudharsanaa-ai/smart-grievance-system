const express = require('express');
const { register, login } = require('../controllers/authController');
const { loginRules, registerRules, validate } = require('../middleware/validatorMiddleware');

const router = express.Router();

router.post('/register', registerRules(), validate, register);
router.post('/login', loginRules(), validate, login);

module.exports = router;
