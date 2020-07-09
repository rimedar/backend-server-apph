var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Expediente = require('../models/expediente');

// <<================================================>>
//    <<<<<<<     Consultar todos los expedientes     >>>>>>>
// <<================================================>>

//db.Prestamo.find({_id:{$in:db.usergroup.find({_id:"g1"}

app.get('/', (req, res, next) => {
	//No es necesaria esta linea ya que no hay contraseñas en esta coleccion
	// Expediente.find({}, 'nombre email img role')
	Expediente.find({})
	//Expediente.find({ prestado: true }) // Solo los expedientes en estado prestado
		//Expediente.find({})
		.exec((err, expedientes) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error cargando expediente',
					errors: err,
				});
			}
			res.status(200).json({
				ok: true,
				expedientes: expedientes,
			});
		});
});

// <<================================================>>
//    <<<<<<<     Busqueda expediente por ID     >>>>>>>
// <<================================================>>

app.get('/:id', (req, res) => {
	var id = req.params.id;
	Expediente.findById(id)
		//.populate('usuario', 'nombre img email')
		.exec((err, expediente) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar expediente',
					errors: err,
				});
			}
			if (!expediente) {
				return res.status(400).json({
					ok: false,
					mensaje: 'El expediente con el id ' + id + ' no existe',
					errors: { message: 'No existe un expediente con ese ID' },
				});
			}
			res.status(200).json({
				ok: true,
				expediente: expediente,
			});
		});
});
/* app.get('/', (req, res, next) => {

    //No es necesaria esta linea ya que no hay contraseñas en esta coleccion
  // Expediente.find({}, 'nombre email img role')
  Expediente.find({})
    .exec((err, expedientes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando expediente',
        errors: err
      });
      }
      res.status(200).json({
        ok: true,
        expedientes: expedientes
    });
  });
});
 */

// <<================================================>>
//    <<<<<<<   Crear nuevo expediente       >>>>>>>
// <<================================================>>

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
	var body = req.body;

	var expediente = new Expediente({
		id_expediente: body.id_expediente,
		cc_solocitante: body.cc_solocitante,
		nombre_predio: body.nombre_predio,
		nombre_solicitante: body.nombre_solicitante,
		tomos: body.tomos,
		//prestado: body.prestado
	});

	expediente.save((err, expedienteGuardado) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error al crear expediente',
				errors: err,
			});
		}

		res.status(201).json({
			ok: true,
			expediente: expedienteGuardado,
			expedientetoken: req.expediente,
		});
	});
});

// <<================================================>>
//    <<<<<<<     Actualizar un expediente     >>>>>>>
// <<================================================>>

// Autenticación pendiente
//app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
	var id = req.params.id;
	var body = req.body;

	Expediente.findById(id, (err, expediente) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar expediente',
				errors: err,
			});
		}

		if (!expediente) {
			return res.status(400).json({
				ok: false,
				mensaje: 'El expediente con el id ' + id + ' no existe',
				errors: { message: 'No existe un expediente con ese ID' },
			});
		}

		(expediente.id_expediente = body.id_expediente),
			(expediente.cc_solocitante = body.cc_solocitante),
			(expediente.nombre_predio = body.nombre_predio),
			(expediente.nombre_solicitante = body.nombre_solicitante),
			(expediente.tomos = body.tomos),
			// expediente.prestado = body.prestado

			expediente.save((err, expedienteGuardado) => {
				if (err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Error al actualizar expediente',
						errors: err,
					});
				}

				res.status(200).json({
					ok: true,
					expediente: expedienteGuardado,
				});
			});
	});
});

// <<================================================>>
//    <<<<<<<   Eliminar un expediente por ID      >>>>>>>
// <<================================================>>

//app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
	var id = req.params.id;

	Expediente.findByIdAndRemove(id, (err, expedienteBorrado) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al borrar expediente',
				errors: err,
			});
		}

		if (!expedienteBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un expediente con ese id',
				errors: { message: 'No existe un expediente con ese id' },
			});
		}

		res.status(200).json({
			ok: true,
			expediente: expedienteBorrado,
		});
	});
});

module.exports = app;
