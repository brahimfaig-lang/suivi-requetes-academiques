// src/controllers/utilisateur.controller.js
const prisma = require('../config/db');

async function listerAgents(req, res) {
  try {
    const agents = await prisma.utilisateur.findMany({
      where: { role: 'AGENT' },
      select: { id: true, nom: true, prenom: true, email: true },
    });
    return res.status(200).json(agents);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

module.exports = { listerAgents };