const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  tipoid: { type: String, default: null },
  id : {type: Number, unique: true},
  email: { type: String, default: null },
  dateborn: { type: String, default: null },
  dateexp: { type: String, default: null },
  ingresos: { type: Number, default: null },
  egresos: { type: Number, default: null },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("usuarios", userSchema);