// src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const requeteRoutes = require('./routes/requete.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');

const app = express();

// Configuration CORS (Doit être placée APRÈS const app = express())
const allowedOrigins = [
  'https://capable-melomakarona-b7eaab.netlify.app',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

app.use(cors({
  origin: (origin, callback) => {
    // Autorise Netlify, Localhost ET l'ouverture directe par double-clic (origin === 'null')
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocage CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes API
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