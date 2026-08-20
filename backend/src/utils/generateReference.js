// src/utils/generateReference.js
const prisma = require('../config/db');

async function generateReference() {
  const annee = new Date().getFullYear();

  const debutAnnee = new Date(`${annee}-01-01T00:00:00.000Z`);
  const finAnnee = new Date(`${annee + 1}-01-01T00:00:00.000Z`);

  const count = await prisma.requete.count({
    where: {
      createdAt: {
        gte: debutAnnee,
        lt: finAnnee,
      },
    },
  });

  const numero = String(count + 1).padStart(5, '0');
  return `REQ-${annee}-${numero}`;
}

module.exports = generateReference;