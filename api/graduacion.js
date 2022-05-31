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
  db.query("SELECT * FROM recetaGraduacion", function selectUsuarios(
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

router.get("/:pedidoId", (req, res, next) => {
  const pedidoId = req.params.pedidoId;

  //Get product list
  db.query(
    "SELECT 'Ojo Derecho' as 'Ojo', " +
      "esfera_derecho as 'esfera'," +
      "cilindro_derecho  as 'cilindro'," +
      "eje_derecho  as 'eje', " +
      "prisma_derecho  as 'prisma', " +
      "base_derecho  as 'base', " +
      "adicion_derecho as 'adicion' " +
      "FROM recetaGraduacion  " +
      "INNER JOIN pedido ON recetaGraduacion.id = pedido.idRecetaGraduacion  " +
      "WHERE pedido.idPedido = ? " +
      "UNION " +
      "SELECT 'Ojo Izquierdo',  " +
      "esfera_izquierdo as 'esfera', " +
      "cilindro_izquierdo  as 'cilindro', " +
      "eje_izquierdo  as 'eje', " +
      "prisma_izquierdo  as 'prisma', " +
      "base_izquierdo  as 'base', " +
      "adicion_izquierdo as 'adicion' " +
      "FROM recetaGraduacion " +
      "INNER JOIN pedido ON recetaGraduacion.id = pedido.idRecetaGraduacion " +
      "WHERE pedido.idPedido = ?",
    [pedidoId, pedidoId],
    function selectUsuarios(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.post("/", (req, res, next) => {
  //Create product
  const receta = {
    esfera_derecho: req.body.values.esfera_derecho,
    cilindro_derecho: req.body.values.cilindro_derecho,
    eje_derecho: req.body.values.eje_derecho,
    prisma_derecho: req.body.values.prisma_derecho,
    base_derecho: req.body.values.base_derecho,
    esfera_izquierdo: req.body.values.esfera_izquierdo,
    cilindro_izquierdo: req.body.values.cilindro_izquierdo,
    eje_izquierdo: req.body.values.eje_izquierdo,
    prisma_izquierdo: req.body.values.prisma_izquierdo,
    base_izquierdo: req.body.values.base_izquierdo,
    adicion_derecho: req.body.values.adicion_derecho,
    adicion_izquierdo: req.body.values.adicion_izquierdo
  };

  db.query(
    "INSERT INTO `recetaGraduacion`(`esfera_derecho`, `cilindro_derecho`,`eje_derecho`,  `prisma_derecho`, `base_derecho`,  `adicion_derecho`, `adicion_izquierdo`,  `base_izquierdo`, `esfera_izquierdo`, `cilindro_izquierdo`,`eje_izquierdo`, `prisma_izquierdo`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      receta.esfera_derecho,
      receta.cilindro_derecho,
      receta.eje_derecho,
      receta.prisma_derecho,
      receta.base_derecho,
      receta.adicion_derecho,
      receta.adicion_izquierdo,
      receta.base_izquierdo,
      receta.esfera_izquierdo,
      receta.cilindro_izquierdo,
      receta.eje_izquierdo,
      receta.prisma_izquierdo
    ],
    function addReceta(err, results, fields) {
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
