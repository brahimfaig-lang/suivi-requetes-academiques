// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/auth.middleware');
const autoriserRoles = require('../middlewares/role.middleware');
const { getStats } = require('../controllers/dashboard.controller');

router.get('/stats', verifierToken, autoriserRoles('ADMIN'), getStats);

module.exports = router;