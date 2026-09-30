const express = require('express');
const router = express.Router();
const signup = require('../controllers/signup');
const login = require('../controllers/login');

// Routes
router.post('/signup', signup);
router.post('/register', signup); // Alias for signup
router.post('/login', login);

module.exports = router;