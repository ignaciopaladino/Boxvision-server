const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const mysql = require("mysql");

var db = mysql.createConnection({
  user: "boxvisio_user",
  password: "Svp5j-48VEcJ",
  host: "190.105.227.203",
  port: "3306"
});

db.query("USE boxvisio_db");

router.get("/", (req, res, next) => {
  //Get product list
  db.query("SELECT * FROM usuarioAfiliado", function selectUsuarios(
    err,
    results,
    fields
  ) {
    if (err) {
      console.log("Error: " + err.message);
      throw err;
    }
    const response = { data: results };
    res.status(200).json(response);
  });
});

router.post("/", (req, res, next) => {
  //Create product
  const usuario = {
    nombre: req.body.values.first_name,
    apellido: req.body.values.last_name,
    numeroAfiliado: req.body.values.num_afiliado,
    email: req.body.values.email,
    telefono: req.body.values.telefono,
    direccion: req.body.values.direccion,
    ciudad: req.body.values.ciudad,
    provincia: req.body.values.provincia
  };

  db.query(
    "INSERT INTO `usuarioAfiliado`(`nombre`, `apellido`, `numeroAfiliado`,`email`,`telefono`,`direccion`,`ciudad`,`provincia`) VALUES (?,?,?,?,?,?,?,?)",
    [
      usuario.nombre,
      usuario.apellido,
      usuario.numeroAfiliado,
      usuario.email,
      usuario.telefono,
      usuario.direccion,
      usuario.ciudad,
      usuario.provincia
    ],
    function addUsuario(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);

        res.status(500).json({ error: err });
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

module.exports = router;
