export default function errorMiddleware(err, req, res, next) {
  console.error('ERREUR:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    errors: err.errors || []
  });
}
