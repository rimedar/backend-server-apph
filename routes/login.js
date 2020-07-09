var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

// <<================================================>>
//    <<<<<<<     Iniciar sesión     >>>>>>>
// <<================================================>>

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu:cargarMenu(usuarioDB.role)
        });
    })
});

function cargarMenu(role) {
    let menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Inicio', url: '/dashboard' },
          ]
        },
        {
          titulo: 'Gestionar',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            //{ titulo: 'Usuarios', url: '/usuarios' },
            { titulo: 'Expedientes', url: '/expedientes' },
            { titulo: 'Prestamos', url: '/prestamos' }
            // { titulo: 'Historico de Prestamos', url: '/historial-prestamos' }
          ]
        }
    ];
    
    if (role === 'ADMIN') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        menu[1].submenu.push(
            { titulo: 'Historico de Prestamos', url: '/historial-prestamos' }
        );
    }
    if (role === 'GESTOR') {
        // menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        menu[1].submenu.push(
            { titulo: 'Historico de Prestamos', url: '/historial-prestamos' }
        );
    }

    return menu;
}

module.exports = app;