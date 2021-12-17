const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const creditoSchema = new mongoose.Schema({
  idCredito : { type: Number },
  idCliente : { type: Number, default: null },
  valor: { type: Number, default: null },
  plazo: { type: Number, default: null },
  tasa: { type: Number },
  cuotas: [{
    numero: { type: Number },
    fecha: { type: String },
    capital: { type: Number },
    interes: { type: Number }
  }]
});

creditoSchema.plugin(AutoIncrement, {inc_field: 'idCredito'});

module.exports = mongoose.model("creditos", creditoSchema);