import { Router } from 'express';
import { apiFetch } from '../api.js';
import requireAuth from '../middlewares/authMiddleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const [movimientos, stock] = await Promise.all([
      apiFetch('/movimientos', req.session.token).then(r => r.json()),
      apiFetch('/movimientos/stock/disponible', req.session.token).then(r => r.json())
    ]);
    res.render('movimientos/index', { movimientos, stock, error: null, usuario: req.session.usuario });
  } catch {
    res.render('movimientos/index', { movimientos: [], stock: [], error: 'No se pudo conectar al backend', usuario: req.session.usuario });
  }
});

router.get('/nuevo', async (req, res) => {
  const [medicamentos, clientes] = await Promise.all([
    apiFetch('/medicamentos', req.session.token).then(r => r.json()),
    apiFetch('/clientes', req.session.token).then(r => r.json())
  ]);
  res.render('movimientos/form', { medicamentos, clientes, error: null, usuario: req.session.usuario });
});

router.post('/', async (req, res) => {
  try {
    const resp = await apiFetch('/movimientos', req.session.token, {
      method: 'POST', body: JSON.stringify(req.body)
    });
    const result = await resp.json();
    if (!resp.ok) {
      const [medicamentos, clientes] = await Promise.all([
        apiFetch('/medicamentos', req.session.token).then(r => r.json()),
        apiFetch('/clientes', req.session.token).then(r => r.json())
      ]);
      return res.render('movimientos/form', { medicamentos, clientes, error: result.mensaje || 'Error', usuario: req.session.usuario });
    }
    res.redirect('/movimientos');
  } catch {
    res.redirect('/movimientos');
  }
});

router.post('/eliminar/:id', async (req, res) => {
  await apiFetch(`/movimientos/${req.params.id}`, req.session.token, { method: 'DELETE' });
  res.redirect('/movimientos');
});

export default router;
