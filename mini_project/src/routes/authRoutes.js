const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router; 