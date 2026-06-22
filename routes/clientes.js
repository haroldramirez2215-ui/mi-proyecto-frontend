import { Router } from 'express';
import { apiFetch } from '../api.js';
import requireAuth from '../middlewares/authMiddleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const data = await apiFetch('/clientes', req.session.token).then(r => r.json());
    res.render('clientes/index', { clientes: data, error: null, usuario: req.session.usuario });
  } catch {
    res.render('clientes/index', { clientes: [], error: 'No se pudo conectar al backend', usuario: req.session.usuario });
  }
});

router.get('/nuevo', (req, res) => {
  res.render('clientes/form', { cliente: null, accion: 'crear', error: null, usuario: req.session.usuario });
});

router.post('/', async (req, res) => {
  try {
    await apiFetch('/clientes', req.session.token, {
      method: 'POST', body: JSON.stringify(req.body)
    });
    res.redirect('/clientes');
  } catch {
    res.render('clientes/form', { cliente: req.body, accion: 'crear', error: 'Error al guardar', usuario: req.session.usuario });
  }
});

router.get('/editar/:id', async (req, res) => {
  const data = await apiFetch(`/clientes/${req.params.id}`, req.session.token).then(r => r.json());
  res.render('clientes/form', { cliente: data, accion: 'editar', error: null, usuario: req.session.usuario });
});

router.post('/editar/:id', async (req, res) => {
  await apiFetch(`/clientes/${req.params.id}`, req.session.token, {
    method: 'PATCH', body: JSON.stringify(req.body)
  });
  res.redirect('/clientes');
});

router.post('/eliminar/:id', async (req, res) => {
  await apiFetch(`/clientes/${req.params.id}`, req.session.token, { method: 'DELETE' });
  res.redirect('/clientes');
});

export default router;
