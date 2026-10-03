const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, subjectController.getSubjects);
router.post('/', authenticateToken, subjectController.createSubject);

module.exports = router;