// src/routes/requete.routes.js
const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/auth.middleware');
const autoriserRoles = require('../middlewares/role.middleware');
const {
  creerRequete,
  mesRequetes,
  listerRequetes,
  detailRequete,
  affecterAgent,
  modifierStatut,
} = require('../controllers/requete.controller');

router.use(verifierToken);

router.post('/', autoriserRoles('ETUDIANT'), creerRequete);
router.get('/mes-requetes', autoriserRoles('ETUDIANT'), mesRequetes);
router.get('/', autoriserRoles('AGENT', 'ADMIN'), listerRequetes);
router.get('/:id', detailRequete);
router.patch('/:id/affecter', autoriserRoles('ADMIN'), affecterAgent);
router.patch('/:id/statut', autoriserRoles('AGENT', 'ADMIN'), modifierStatut);

module.exports = router;