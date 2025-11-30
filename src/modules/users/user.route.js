const { Router } = require('express');
const { loginAdmin, registerUser, getAllUsers } = require('./user.controller');
const { verifyToken, requireAdmin } = require('../../middlewares/auth');
const router = Router();

// Admin login
router.post('/login', loginAdmin);

// Public register
router.post('/register', registerUser);

// Admin-only: get all users
router.get('/', verifyToken, requireAdmin, getAllUsers);

module.exports = router;
