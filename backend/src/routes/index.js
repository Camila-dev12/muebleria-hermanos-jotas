const { Router } = require('express');
const productosRoutes = require('./productosRoutes');
const authRoutes = require('./authRoutes');

/**
 * Router raíz de la API. Cada recurso se monta sobre su propio prefijo.
 */
const apiRouter = Router();

apiRouter.use('/productos', productosRoutes);
apiRouter.use('/auth', authRoutes);

module.exports = apiRouter;
