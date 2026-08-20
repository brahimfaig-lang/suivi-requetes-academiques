// src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const requeteRoutes = require('./routes/requete.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requetes', requeteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "API en ligne." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée." });
});

module.exports = app;