// src/controllers/dashboard.controller.js
const prisma = require('../config/db');

async function getStats(req, res) {
  try {
    // Nombre total de requêtes
    const total = await prisma.requete.count();

    // Répartition par statut
    const parStatutRaw = await prisma.requete.groupBy({
      by: ['statut'],
      _count: { statut: true },
    });
    const parStatut = parStatutRaw.map(item => ({
      statut: item.statut,
      total: item._count.statut,
    }));

    // Répartition par type
    const parTypeRaw = await prisma.requete.groupBy({
      by: ['type'],
      _count: { type: true },
    });
    const parType = parTypeRaw.map(item => ({
      type: item.type,
      total: item._count.type,
    }));

    // Charge par agent (requêtes affectées, hors non-affectées)
    const parAgentRaw = await prisma.requete.groupBy({
      by: ['agentId'],
      _count: { agentId: true },
      where: { agentId: { not: null } },
    });

    const parAgent = await Promise.all(
      parAgentRaw.map(async (item) => {
        const agent = await prisma.utilisateur.findUnique({
          where: { id: item.agentId },
          select: { nom: true, prenom: true },
        });
        return {
          agent: agent ? `${agent.prenom} ${agent.nom}` : 'Inconnu',
          total: item._count.agentId,
        };
      })
    );

    return res.status(200).json({
      total,
      parStatut,
      parType,
      parAgent,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

module.exports = { getStats };