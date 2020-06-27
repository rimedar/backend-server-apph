var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Prestamo = require('../models/prestamo');
const expediente = require('../models/expediente');

// <<================================================>>
//    <<<<<<<     Consultar todos los prestamos     >>>>>>>
// <<================================================>>


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    Prestamo.find({})
    .skip(desde)
      //.limit(5)
      // Se debe poner populate(nombre de campo referecial), no el nombre de la coleccion
     .populate('id_exp')
    .populate('id_usuario', 'nombre correo')
      .exec((err, prestamos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargandoprestamo',
          errors: err
        });
        }
        Prestamo.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          prestamos: prestamos,
          total: conteo
        });
      })
  
  });
  });

/* app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Prestamo.find({})
  .skip(desde)
    .limit(5)
    // Se debe poner populate(nombre de campo referecial), no el nombre de la coleccion
   .populate('id_exp')
  .populate('id_usuario', 'nombre correo')
    .exec((err, prestamos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargandoprestamo',
        errors: err
      });
      }
      Prestamo.countDocuments({}, (err, conteo) => {
      res.status(200).json({
        ok: true,
        prestamos: prestamos,
        total: conteo
      });
    })

});
}); */


// <<================================================>>
//    <<<<<<<   Crear nuevo prestamo       >>>>>>>
// <<================================================>>

app.post('/', (req, res) => {

  var body = req.body;

  var prestamo = new Prestamo({
    item: body.item,
    fecha_prestamo: body.fecha_prestamo,
    // expediente_id: body.expediente_id,
    id_exp: body.id_exp,
    id_usuario:body.id_usuario,
    fecha_devolucion: body.fecha_devolucion
  });

  prestamo.save((err, prestamoGuardado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crearprestamo',
        errors: err
      });
    } else {
      expediente.findByIdAndUpdate(body.id_exp, { prestado: true }, (err, expediente) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar expediente',
            errors: err
          });
        } else {
          res.status(201).json({
            ok: true,
            prestamo: prestamoGuardado,
          });
        }
      });
    }

      
   
   //actualezarEstadoExpediente(id_exp);
    //   expediente.findById(body.id_exp, (err, expediente) => {


    //     // if (err) {
    //     //     return res.status(500).json({
    //     //         ok: false,
    //     //         mensaje: 'Error al buscar expediente',
    //     //         errors: err
    //     //     });
    //     // }
  
    //     // if (!expediente) {
    //     //     return res.status(400).json({
    //     //         ok: false,
    //     //         mensaje: 'El expediente con el id ' + id + ' no existe',
    //     //         errors: { message: 'No existe un expediente con ese ID' }
    //     //     });
    //     // }
  
    //     // expediente.id_expediente = body.id_expediente,
    //     // expediente.cc_solocitante = body.cc_solocitante,
    //     // expediente.nombre_predio = body.nombre_predio,
    //     // expediente.nombre_solicitante = body.nombre_solicitante,
    //     // expediente.tomos = body.tomos,
    //     expediente.prestado = true
      
  
    //     expediente.save((err, expedienteGuardado) => {
  
    //         // if (err) {
    //         //     return res.status(400).json({
    //         //         ok: false,
    //         //         mensaje: 'Error al actualizar expediente',
    //         //         errors: err
    //         //     });
    //         // }
  
    //         res.status(200).json({
    //             ok: true,
    //             expediente: expedienteGuardado
    //         });
  
    //     });
  
    // });
      
  });

});

// <<================================================>>
//    <<<<<<<     Actualizar un prestamo     >>>>>>>
// <<================================================>>

/* app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  var body = req.body;

  Prestamo.findById(id, (err,prestamo) => {


      if (err) {
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscarprestamo',
              errors: err
          });
      }

      if (!expediente) {
          return res.status(400).json({
              ok: false,
              mensaje: 'El prestamo con el id ' + id + ' no existe',
              errors: { message: 'No existe un prestamo con ese ID' }
          });
      }


      prestamo.fecha_prestamo = body.fecha_prestamo;
      prestamo.id_exp = body.id_exp;
      prestamo.id_usuario = body.id_usuario;
      prestamo.fecha_devolucion = body.fecha_devolucion;

     prestamo.save((err, prestamoGuardado) => {

          if (err) {
              return res.status(400).json({
                  ok: false,
                  mensaje: 'Error al actualizar el prestamo',
                  errors: err
              });
          }

          res.status(200).json({
              ok: true,
             prestamo: prestamoGuardado
          });

      });

  });

}); */

// <<================================================>>
//    <<<<<<<   Eliminar un prestamo por ID      >>>>>>>
// <<================================================>>
// Ningun registro de prestamo se podra eliminar

/* app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Prestamo.findByIdAndRemove(id, (err,prestamoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrarprestamo',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe unprestamo con ese id',
                errors: { message: 'No existe unprestamo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
           prestamo:prestamoBorrado
        });

    });

}); */

module.exports = app;