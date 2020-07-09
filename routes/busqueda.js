var express = require('express');

var app = express();

var Expediente = require('../models/expediente');
var Prestamo = require('../models/prestamo');
var Usuario = require('../models/usuario');
var HistoricoPrestamo = require('../models/historial-prestamo');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'prestamos':
            promesa = buscarPrestamos(busqueda, regex);
            break;
        
        case 'historico-prestamos':
                promesa = buscarHistoricoPrestamos(busqueda, regex);
                break;

        case 'expedientes':
            promesa = buscarExpedientes(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, prestamos, historico-prestamos y expedientes',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarExpedientes(busqueda, regex),
            buscarPrestamos(busqueda, regex),
            buscarHistoricoPrestamos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                expedientes: respuestas[0],
                prestamos: respuestas[1],
                historicoPrestamos:respuestas[2],
                usuarios: respuestas[3]
            });
        })


});


function buscarExpedientes(busqueda, regex) {
    //console.log("Aqui" + typeof busqueda);
    //busqueda = parseInt(busqueda);
    //console.log("Aqui" + typeof busqueda);
    return new Promise((resolve, reject) => {

        //Expediente.find({ cc_solocitante: regex })
        Expediente.find({})
            .or([{ 'id_expediente': regex  }, { 'cc_solocitante': regex }, { 'nombre_predio': regex }])
            .populate('Usuario', 'nombre email')
            .exec((err, expedientes) => {
                if (err) {
                    reject('Error al cargar expedientes', err);
                } else {
                    resolve(expedientes)
                }
            });
    });
}

function is_numeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

function buscarPrestamos(busqueda, regex) {
    //busqueda = parseInt(busqueda);
    //regex = parseInt(regex);
    console.log(is_numeric(regex));
    // if (is_numeric(busqueda)) {
        
    // }
    return new Promise((resolve, reject) => {

        //Prestamo.find({ id_usuario: { nombre: regex } })
        Prestamo.find({ })
        //Prestamo.find({id_usuario : {nombre: busqueda}},{nombre:1,correo:1,_id:0, role:0})
            //.or([ { 'id_usuario': { nombre: busqueda }}, {'id_usuario': busqueda}])
            .populate('usuario', 'nombre correo')
            .populate('expediente')
            .or([{'id_exp': busqueda}, {'id_usuario': busqueda}])
            .exec((err, prestamos) => {

                if (err) {  
                    reject('Error al cargar prestamos', err);
                } else {
                    resolve(prestamos);
                    console.log(prestamos);
                    
                }
            });
    });
}

function buscarHistoricoPrestamos(busqueda, regex) {
    //busqueda = parseInt(busqueda);
    //regex = parseInt(regex);
    console.log(is_numeric(regex));
    // if (is_numeric(busqueda)) {
        
    // }
    return new Promise((resolve, reject) => {

        //Prestamo.find({ id_usuario: { nombre: regex } })
        HistoricoPrestamo.find({ })
        //Prestamo.find({id_usuario : {nombre: busqueda}},{nombre:1,correo:1,_id:0, role:0})
            //.or([ { 'id_usuario': { nombre: busqueda }}, {'id_usuario': busqueda}])
            .populate('usuario', 'nombre correo')
            .populate('expediente')
            .or([{'id_exp': busqueda}, {'id_usuario': busqueda}])
            .exec((err, hPrestamos) => {

                if (err) {  
                    reject('Error al cargar historial de prestamos', err);
                } else {
                    resolve(hPrestamos);
                    console.log(hPrestamos);
                    
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, {password:0})
            .or([{ 'nombre': regex }, { 'correo': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;