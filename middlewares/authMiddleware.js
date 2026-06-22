// Middleware que verifica si el usuario tiene sesión activa.
// Si no, lo redirige al login.
const requireAuth = (req, res, next) => {
  if (req.session && req.session.token && req.session.usuario) {
    return next();
  }
  res.redirect('/login');
};

export default requireAuth;
