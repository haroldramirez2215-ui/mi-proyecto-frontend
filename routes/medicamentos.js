import { Router } from 'express';
import { apiFetch } from '../api.js';
import requireAuth from '../middlewares/authMiddleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const data = await apiFetch('/medicamentos', req.session.token).then(r => r.json());
    res.render('medicamentos/index', { medicamentos: data, error: null, usuario: req.session.usuario });
  } catch {
    res.render('medicamentos/index', { medicamentos: [], error: 'No se pudo conectar al backend', usuario: req.session.usuario });
  }
});

router.get('/nuevo', (req, res) => {
  res.render('medicamentos/form', { medicamento: null, accion: 'crear', error: null, usuario: req.session.usuario });
});

router.post('/', async (req, res) => {
  try {
    await apiFetch('/medicamentos', req.session.token, {
      method: 'POST', body: JSON.stringify(req.body)
    });
    res.redirect('/medicamentos');
  } catch {
    res.render('medicamentos/form', { medicamento: req.body, accion: 'crear', error: 'Error al guardar', usuario: req.session.usuario });
  }
});

router.get('/editar/:id', async (req, res) => {
  const data = await apiFetch(`/medicamentos/${req.params.id}`, req.session.token).then(r => r.json());
  res.render('medicamentos/form', { medicamento: data, accion: 'editar', error: null, usuario: req.session.usuario });
});

router.post('/editar/:id', async (req, res) => {
  await apiFetch(`/medicamentos/${req.params.id}`, req.session.token, {
    method: 'PATCH', body: JSON.stringify(req.body)
  });
  res.redirect('/medicamentos');
});

router.post('/eliminar/:id', async (req, res) => {
  await apiFetch(`/medicamentos/${req.params.id}`, req.session.token, { method: 'DELETE' });
  res.redirect('/medicamentos');
});

export default router;
