const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, noteController.createNote);

module.exports = router;