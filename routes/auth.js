import { Router } from 'express';
import fetch from 'node-fetch';
import API_URL from '../api.js';

const router = Router();

// GET /login — mostrar formulario
router.get('/login', (req, res) => {
  if (req.session && req.session.token) {
    return res.redirect('/clientes');
  }
  res.render('auth/login', { error: null });
});

// POST /login — procesar login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const resp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.render('auth/login', { error: data.error || 'Credenciales incorrectas' });
    }

    // Guardar token y datos del usuario en sesión
    req.session.token   = data.token;
    req.session.usuario = data.usuario;

    res.redirect('/clientes');

  } catch {
    res.render('auth/login', { error: 'No se pudo conectar al servidor. ¿Está corriendo el backend?' });
  }
});

// POST /logout — cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
