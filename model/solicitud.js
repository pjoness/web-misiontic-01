const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const solicitudSchema = new mongoose.Schema({
  id : { type: Number },
  idCliente : { type: Number, default: null },
  valor: { type: Number, default: null },
  plazo: { type: Number, default: null },
});

solicitudSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model("solicitudes", solicitudSchema);