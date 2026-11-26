const { Schema, model } = require('mongoose');

const ROLES_VALIDOS = ['cliente', 'admin'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El campo 'nombre' es obligatorio"],
      trim: true,
      minlength: [2, "El campo 'nombre' debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El campo 'email' es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "El campo 'email' no tiene un formato válido"],
    },
    password: {
      type: String,
      required: [true, "El campo 'password' es obligatorio"],
      select: false,
    },
    rol: {
      type: String,
      enum: {
        values: ROLES_VALIDOS,
        message: "El campo 'rol' debe ser 'cliente' o 'admin'",
      },
      default: 'cliente',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
module.exports.ROLES_VALIDOS = ROLES_VALIDOS;
