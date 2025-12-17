const express = require('express');
const router = express.Router();
const { loginOrCreate, healthCheck } = require('../controllers/authController'); // ✅ destructured import

// POST login or create
router.post('/login-or-create', loginOrCreate);

// GET health check
router.get('/health', healthCheck);

module.exports = router;
