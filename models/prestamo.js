var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var prestamoSchema = new Schema({
  item: { type: Number, required: false },
  fecha_prestamo: { type: String, required: true },
  //expediente_id: { type: Number,  unique: true, required: true },
  id_exp: {
    type: Schema.Types.ObjectId,
    ref: 'Expediente',
    unique: true,
    required: [true, 'El id del Expediente es un campo obligatorio ']
  },
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El id del Usuario es un campo obligatorio ']
  },
  //tomo: { type: Schema.Types.Number, required: [true, 'Los tomos son necesarios'] },
  fecha_devolucion: { type: String, required: false }
});

prestamoSchema.plugin(AutoIncrement, {inc_field: 'item'});
prestamoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Prestamo', prestamoSchema);