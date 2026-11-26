const { Router } = require('express');
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', listarProductos);
router.post('/', requireAuth, requireRole('admin'), crearProducto);
router.get('/:id', obtenerProducto);
router.put('/:id', requireAuth, requireRole('admin'), actualizarProducto);
router.delete('/:id', requireAuth, requireRole('admin'), eliminarProducto);

module.exports = router;
