// Con este archivo se generan datos aleatorios json
// debe tener instalada la libreria faker
// ejecutar node guardar_json.js
// el archivo json generado se guarda en la ruta principal del proyecto
var bcrypt = require('bcryptjs');
const faker = require('faker');
const fs = require('fs')
faker.locale = "es";

let srt;

// function generarExpedientes() {

//   let users = []

//   for (let id=1; id <= 100; id++) {

//     let idExpediente = faker.address.zipCode();
//     let ccSolicitante = faker.address.zipCode() + faker.address.zipCode();
//     let nombrePredio = recortador();
//     let nombreSolicitante = faker.name.findName();
//     let numeroTomos = Math.floor(Math.random() * 2) + 1;
//     let enPrestamo = false;

//     users.push({
//         "id_expediente": idExpediente,
//         "cc_solocitante": ccSolicitante,
//         "nombre_predio": nombrePredio,
//         "nombre_solicitante": nombreSolicitante,
//         "tomos": numeroTomos,
//         "prestado": enPrestamo,
//       });
//   }

//   return { "data": users }
// }

// function recortador() {
//   this.srt = faker.address.streetAddress();
//   return this.srt.split(' ')[2];
// }

// let dataObj = generarExpedientes();

let roles = ["GESTOR", "MISIONAL"];

// Poner contraseña a usar en la base
let pass = '123456';

function generarUsuarios() {

  let users = []

  for (let id=1; id <= 10; id++) {

    let nombre = faker.name.findName();
    let correo = faker.internet.email();
    let password = bcrypt.hashSync(pass, 10);
    let role = roles[Math.floor(Math.random() * roles.length)];

    users.push({
        "nombre": nombre,
        "correo": correo,
        "password": password,
        "role": role,
      });
  }

  return { "data": users }
}

let dataObj = generarUsuarios();


fs.writeFileSync('usuarios.json', JSON.stringify(dataObj, null, '\t'));