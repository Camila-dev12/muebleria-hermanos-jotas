const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const usersRepository = require('../data/usersRepository');
const HttpError = require('../errors/HttpError');

function extraerBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;

  const [esquema, token] = header.split(' ');
  if (esquema !== 'Bearer' || !token) return null;

  return token.trim();
}

async function requireAuth(req, res, next) {
  const token = extraerBearerToken(req);
  if (!token) {
    throw HttpError.unauthorized('Autenticación requerida');
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw HttpError.unauthorized('Token inválido o expirado');
  }

  const usuario = await usersRepository.buscarPorId(payload.sub);
  if (!usuario) {
    throw HttpError.unauthorized('El usuario del token ya no existe');
  }

  req.user = usuario;
  next();
}

function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      throw HttpError.unauthorized('Autenticación requerida');
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      throw HttpError.forbidden('No tenés permisos para realizar esta acción');
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
