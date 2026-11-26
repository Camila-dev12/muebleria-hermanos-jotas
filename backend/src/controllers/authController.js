const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const usersRepository = require('../data/usersRepository');
const HttpError = require('../errors/HttpError');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;

function leerObjetoJson(req) {
  const cuerpo = req.body;
  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    throw HttpError.badRequest('El cuerpo de la petición debe ser un objeto JSON');
  }
  return cuerpo;
}

function serializarUsuario(usuario) {
  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  };
}

function firmarToken(usuario) {
  return jwt.sign(
    { sub: String(usuario._id), rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function validarRegistro(cuerpo) {
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const password = typeof cuerpo.password === 'string' ? cuerpo.password : '';

  if (!nombre) throw HttpError.badRequest("El campo 'nombre' es obligatorio");
  if (!email) throw HttpError.badRequest("El campo 'email' es obligatorio");
  if (!password) throw HttpError.badRequest("El campo 'password' es obligatorio");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw HttpError.badRequest(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }

  return { nombre, email, password };
}

function validarLogin(cuerpo) {
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const password = typeof cuerpo.password === 'string' ? cuerpo.password : '';

  if (!email || !password) {
    throw HttpError.badRequest('Debés ingresar email y contraseña');
  }

  return { email, password };
}

async function registrar(req, res) {
  const { nombre, email, password } = validarRegistro(leerObjetoJson(req));

  const existente = await usersRepository.buscarPorEmail(email);
  if (existente) {
    throw HttpError.conflict('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const usuario = await usersRepository.crear({
    nombre,
    email,
    password: passwordHash,
    rol: 'cliente',
  });

  res.status(201).json({
    data: {
      token: firmarToken(usuario),
      user: serializarUsuario(usuario),
    },
  });
}

async function login(req, res) {
  const { email, password } = validarLogin(leerObjetoJson(req));

  const usuario = await usersRepository.buscarPorEmail(email, { incluirPassword: true });
  const passwordValida = usuario ? await bcrypt.compare(password, usuario.password) : false;

  if (!usuario || !passwordValida) {
    throw HttpError.unauthorized('Credenciales inválidas');
  }

  res.status(200).json({
    data: {
      token: firmarToken(usuario),
      user: serializarUsuario(usuario),
    },
  });
}

function obtenerPerfil(req, res) {
  res.status(200).json({ data: serializarUsuario(req.user) });
}

module.exports = {
  registrar,
  login,
  obtenerPerfil,
};
