// src/routes/utilisateur.routes.js
const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/auth.middleware');
const autoriserRoles = require('../middlewares/role.middleware');
const { listerAgents } = require('../controllers/utilisateur.controller');

router.get('/agents', verifierToken, autoriserRoles('ADMIN'), listerAgents);

module.exports = router;