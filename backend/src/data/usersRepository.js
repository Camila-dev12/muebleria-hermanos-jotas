const User = require('../models/User');

function buscarPorEmail(email, { incluirPassword = false } = {}) {
  const query = User.findOne({ email: email.toLowerCase().trim() });
  return incluirPassword ? query.select('+password') : query;
}

function buscarPorId(id) {
  return User.findById(id);
}

function crear(datos) {
  return User.create(datos);
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  crear,
};
