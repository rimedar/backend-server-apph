var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var expedienteSchema = new Schema({

  id_expediente: { type: String, required: [true, 'El id del expediente es necesario'] },
  cc_solocitante: { type: String, unique: true, required: [true, 'La cedula del solicitante es necesaria'] },
  nombre_predio: { type: String, required: [true, 'El nombre del predio es necesario'] },
  nombre_solicitante: { type: String, required: [true, 'El nombre del solicitante es necesario'] },
  tomos: { type: Number, required: true, default: '1'},
  prestado: { type: Boolean, required: false, default: false}

});

expedienteSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Expediente', expedienteSchema);