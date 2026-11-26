const { Router } = require('express');
const { registrar, login, obtenerPerfil } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', requireAuth, obtenerPerfil);

module.exports = router;
