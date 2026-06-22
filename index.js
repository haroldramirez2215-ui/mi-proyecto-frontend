import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import authRouter        from './routes/auth.js';
import clientesRouter    from './routes/clientes.js';
import medicamentosRouter from './routes/medicamentos.js';
import movimientosRouter from './routes/movimientos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = 4000;

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sesiones
app.use(session({
  secret: 'pharmatodo_session_secret_2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 } // 8 horas
}));

// Rutas
app.get('/', (req, res) => res.redirect('/login'));
app.use('/',             authRouter);
app.use('/clientes',     clientesRouter);
app.use('/medicamentos', medicamentosRouter);
app.use('/movimientos',  movimientosRouter);

app.listen(PORT, () => {
  console.log(`✅ PharmaTo-do Frontend corriendo en http://localhost:${PORT}`);
});
