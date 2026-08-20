// src/services/historique.service.js
const prisma = require('../config/db');

async function enregistrerHistorique({ requeteId, auteurId, action, ancienStatut = null, nouveauStatut = null, commentaire = null }) {
  return prisma.historique.create({
    data: {
      requeteId,
      auteurId,
      action,
      ancienStatut,
      nouveauStatut,
      commentaire,
    },
  });
}

module.exports = { enregistrerHistorique };