// js/auth.js
function sauvegarderSession(token, utilisateur) {
  localStorage.setItem('token', token);
  localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
}

function getUtilisateur() {
  const data = localStorage.getItem('utilisateur');
  return data ? JSON.parse(data) : null;
}

function estConnecte() {
  return !!localStorage.getItem('token');
}

function deconnexion() {
  localStorage.removeItem('token');
  localStorage.removeItem('utilisateur');
  const estRacine = window.location.pathname.endsWith('/frontend/') || window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/etudiant/') && !window.location.pathname.includes('/agent/') && !window.location.pathname.includes('/admin/');
  window.location.href = estRacine ? 'index.html' : '../index.html';
}

function redirigerSelonRole() {
  const utilisateur = getUtilisateur();
  if (!utilisateur) return;

  if (utilisateur.role === 'ETUDIANT') window.location.href = 'etudiant/dashboard.html';
  else if (utilisateur.role === 'AGENT') window.location.href = 'agent/dashboard.html';
  else if (utilisateur.role === 'ADMIN') window.location.href = 'admin/dashboard.html';
}