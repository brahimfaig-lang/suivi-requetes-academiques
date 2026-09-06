// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

async function register(req, res) {
  try {
    const { nom, prenom, email, motDePasse, role, matricule } = req.body;

   if ((userRole === 'ETUDIANT' || userRole === 'Étudiant') && (!matricule || !matricule.trim())) {
      return res.status(400).json({ 
        message: "Le matricule est obligatoire pour un compte étudiant." 
      });
    }

    const existant = await prisma.utilisateur.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const hash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hash,
        role: role || 'ETUDIANT',
        matricule: matricule || null,
      },
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès.",
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
}

module.exports = { register, login };