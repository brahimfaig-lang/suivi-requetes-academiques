// src/controllers/requete.controller.js
const prisma = require('../config/db');
const generateReference = require('../utils/generateReference');
const { enregistrerHistorique } = require('../services/historique.service');

async function creerRequete(req, res) {
  try {
    const { type, objet, description } = req.body;
    const etudiantId = req.utilisateur.id;

    const reference = await generateReference();

    const requete = await prisma.requete.create({
      data: { reference, type, objet, description, etudiantId },
    });

    await enregistrerHistorique({
      requeteId: requete.id,
      auteurId: etudiantId,
      action: "Soumission de la requête",
      nouveauStatut: "SOUMISE",
    });

    return res.status(201).json({ message: "Requête soumise avec succès.", requete });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function mesRequetes(req, res) {
  try {
    const etudiantId = req.utilisateur.id;
    const requetes = await prisma.requete.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(requetes);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function listerRequetes(req, res) {
  try {
    const { statut, type, reference } = req.query;

    const where = {};
    if (statut) where.statut = statut;
    if (type) where.type = type;
    if (reference) where.reference = { contains: reference, mode: 'insensitive' };

    const requetes = await prisma.requete.findMany({
      where,
      include: { etudiant: { select: { nom: true, prenom: true, matricule: true } }, agent: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(requetes);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function detailRequete(req, res) {
  try {
    const { id } = req.params;
    const requete = await prisma.requete.findUnique({
      where: { id: Number(id) },
      include: {
        etudiant: { select: { nom: true, prenom: true, matricule: true, email: true } },
        agent: { select: { nom: true, prenom: true } },
        historiques: { orderBy: { createdAt: 'asc' }, include: { auteur: { select: { nom: true, prenom: true } } } },
      },
    });

    if (!requete) return res.status(404).json({ message: "Requête introuvable." });

    return res.status(200).json(requete);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function affecterAgent(req, res) {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    const auteurId = req.utilisateur.id;

    const requete = await prisma.requete.update({
      where: { id: Number(id) },
      data: { agentId, statut: 'EN_COURS_DE_TRAITEMENT' },
    });

    await enregistrerHistorique({
      requeteId: requete.id,
      auteurId,
      action: "Affectation à un agent",
      ancienStatut: 'SOUMISE',
      nouveauStatut: 'EN_COURS_DE_TRAITEMENT',
    });

    return res.status(200).json({ message: "Agent affecté.", requete });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function modifierStatut(req, res) {
  try {
    const { id } = req.params;
    const { statut, commentaire, motifRejet } = req.body;
    const auteurId = req.utilisateur.id;

    const requeteActuelle = await prisma.requete.findUnique({ where: { id: Number(id) } });
    if (!requeteActuelle) return res.status(404).json({ message: "Requête introuvable." });

    const dataUpdate = { statut };
    if (statut === 'REJETEE') {
      if (!motifRejet) return res.status(400).json({ message: "Le motif de rejet est obligatoire." });
      dataUpdate.motifRejet = motifRejet;
    }

    const requete = await prisma.requete.update({
      where: { id: Number(id) },
      data: dataUpdate,
    });

    await enregistrerHistorique({
      requeteId: requete.id,
      auteurId,
      action: statut === 'EN_ATTENTE_DE_COMPLEMENT' ? "Demande de complément d'information" : "Changement de statut",
      ancienStatut: requeteActuelle.statut,
      nouveauStatut: statut,
      commentaire: commentaire || motifRejet || null,
    });

    return res.status(200).json({ message: "Statut mis à jour.", requete });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

module.exports = {
  creerRequete,
  mesRequetes,
  listerRequetes,
  detailRequete,
  affecterAgent,
  modifierStatut,
};