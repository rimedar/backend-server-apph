var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Schema = mongoose.Schema;

// Estados de prestamo ACTIVO, VENCER, VENCIDO, DEVUELTO
var historialPrestamoSchema = new Schema({
  registro: { type: Number, required: false },
  id_expediente: { type: String, required: true },
  nombre_usuario: { type: String, required: true },
  fecha_prestamo: { type: String, required: true },
  estado_prestamo: { type: String, required: true, default: 'DEVUELTO' },
  //fecha_vence: { type: String, required: true },
  fecha_devolucion: { type: String, required: true },
  id_exp: {
    type: Schema.Types.ObjectId,
    ref: 'Expediente',
    required: [true, 'El id del Expediente es un campo obligatorio ']
  },
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El id del Usuario es un campo obligatorio ']
  },
});

historialPrestamoSchema.plugin(AutoIncrement, { inc_field: 'registro' });

module.exports = mongoose.model('HistorialPrestamo', historialPrestamoSchema);