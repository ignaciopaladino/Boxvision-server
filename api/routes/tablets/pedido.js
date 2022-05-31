const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const mysql = require("mysql");

var db = mysql.createConnection({
  user: "boxvisio_userdev_tablets",
  password: "lKsb^QDvpg}X",
  host: "190.105.227.203",
  port: "3306"
});

db.query("USE boxvisio_db_tablets_dev");

router.get("/", (req, res, next) => {
  //Get product list
  db.query(
    "SELECT * FROM pedido " +
      "INNER JOIN usuarioAfiliado ON pedido.idUsuario = usuarioAfiliado.id ",
    function selectPedidos(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.get("/:pedidoId", (req, res, next) => {
  const id = req.params.pedidoId;
  db.query(
    "SELECT pp.idProducto, pp.precio as 'precioOrden',pp.color, p.* FROM `pedido-producto` as pp " +
      "INNER JOIN product as p ON pp.idProducto = p.id " +
      "WHERE idPedido = " +
      id,
    function selectOrden(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.post("/procesar", (req, res, next) => {
  const pedidoId = req.body.values.idPedido;
  db.query(
    "UPDATE pedido " +
      "SET estado = 'procesado' " +
      "WHERE idPedido = " +
      pedidoId,
    function selectOrden(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      db.query(
        "SELECT pp.idProducto, pp.precio as 'precioOrden',pp.color, p.* FROM `pedido-producto` as pp " +
          "INNER JOIN product as p ON pp.idProducto = p.id " +
          "WHERE idPedido = " +
          pedidoId,
        function selectOrden(err, results, fields) {
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }
          const response = { data: results };
          res.status(200).json(response);
        }
      );
    }
  );
});

router.post("/pago", (req, res, next) => {
  console.log(req.body.values.idPedido);
  console.log(req.body.parcial);
  console.log(req.body.total);
  const pedidoId = req.body.values.idPedido;
  const pagoParcial = req.body.parcial;
  const pagoTotal = req.body.total;

  db.query(
    "UPDATE pedido " + "SET pagoParcial = ?, pagoTotal =  ? WHERE idPedido = ?",
    [pagoParcial, pagoTotal, pedidoId],
    function selectOrden(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      db.query(
        "SELECT pp.idProducto, pp.precio as 'precioOrden',pp.color, p.* FROM `pedido-producto` as pp " +
          "INNER JOIN product as p ON pp.idProducto = p.id " +
          "WHERE idPedido = " +
          pedidoId,
        function selectOrden(err, results, fields) {
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }
          const response = { data: results };
          res.status(200).json(response);
        }
      );
    }
  );
});

router.post("/cerrar", (req, res, next) => {
  const pedidoId = req.body.values.idPedido;
  db.query(
    "UPDATE pedido " +
      "SET estado = 'cerrado' " +
      "WHERE idPedido = " +
      pedidoId,
    function selectOrden(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      db.query(
        "SELECT pp.idProducto, pp.precio as 'precioOrden',pp.color, p.* FROM `pedido-producto` as pp " +
          "INNER JOIN product as p ON pp.idProducto = p.id " +
          "WHERE idPedido = " +
          pedidoId,
        function selectOrden(err, results, fields) {
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }
          const response = { data: results };
          res.status(200).json(response);
        }
      );
    }
  );
});

router.post("/", (req, res, next) => {
  //Create product
  const pedido = {
    usuarioId: req.body.values.usuarioId,
    numeroVoucher: req.body.values.numero_voucher,
    idRecetaGraduacion: req.body.values.idRecetaGraduacion,
    idTipoLente: req.body.values.idTipoLente,
    precioLente: req.body.values.precioTipoLente,
    antireflejo: req.body.values.antireflejo,
    precioAntireflejo: req.body.values.precioAntireflejo,
    fotocromatico: req.body.values.fotocromatico,
    precioFotocromatico: req.body.values.precioFotocromatico,
    idMarco: req.body.values.idMarco,
    precioMarco: req.body.values.precioMarco,
    total: req.body.values.total,
    color: req.body.values.color,
    recetaImage: req.body.values.recetaImage
  };

  db.query(
    "INSERT INTO `pedido`(`idUsuario`, `fechaIngreso`, `estado`,`idRecetaGraduacion`,`total`,`numeroVoucher`,`urlReceta`) VALUES (?,NOW(),'nueva',?,?,?,?)",
    [
      pedido.usuarioId,
      pedido.idRecetaGraduacion,
      pedido.total,
      pedido.numeroVoucher,
      pedido.recetaImage
    ],
    function addPedido(err, results, fields) {
      var pedidoId = results.insertId;

      db.query(
        "INSERT INTO `pedido-producto`(`idPedido`, `idProducto`, `precio`, `color`) VALUES (?,?,?,?)",
        [pedidoId, pedido.idMarco, pedido.precioMarco, pedido.color],
        function addPedidoProducto(err, results, fields) {}
      );

      db.query(
        "INSERT INTO `pedido-producto`(`idPedido`, `idProducto`, `precio`) VALUES (?,?,?)",
        [pedidoId, pedido.idTipoLente, pedido.precioLente],
        function addPedidoProducto(err, results, fields) {}
      );

      if (pedido.antireflejo !== "") {
        db.query(
          "INSERT INTO `pedido-producto`(`idPedido`, `idProducto`, `precio`) VALUES (?,?,?)",
          [pedidoId, pedido.antireflejo, pedido.precioAntireflejo],
          function addPedidoProducto(err, results, fields) {}
        );
      }

      if (pedido.fotocromatico !== "") {
        db.query(
          "INSERT INTO `pedido-producto`(`idPedido`, `idProducto`, `precio`) VALUES (?,?,?)",
          [pedidoId, pedido.fotocromatico, pedido.precioFotocromatico],
          function addPedidoProducto(err, results, fields) {}
        );
      }

      if (err) {
        console.log("Error: " + err.message);

        res.status(500).json({ error: err });
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.post("/pagoMP", (req, res, next) => {
  console.log(req.body.values.idPedido);
  console.log(req.body.values.parcial);
  console.log(req.body.values.total);
  const pedidoId = req.body.values.idPedido;
  const pagoParcial = req.body.values.parcial;
  const pagoTotal = req.body.values.total;
  
  const payment_id = req.body.values.payment_id;
  const payment_type = req.body.values.payment_type;
  const merchant_order_id = req.body.values.merchant_order_id;
  const preference_id = req.body.values.preference_id;

  const sede = req.body.values.sede;

  db.query(
    "UPDATE pedido " + "SET pagoParcial = ?, pagoTotal =  ?, estado = 'pagado', mp_preference_id =  ?, mp_merchant_order_id =  ?, mp_payment_id =  ?, mp_payment_type =  ?, sede =  ? WHERE idPedido = ?",
    [pagoParcial, pagoTotal, preference_id, merchant_order_id, payment_id, payment_type, sede, pedidoId],
    function selectOrden(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        res.status(500).json({ error: err });
      }
      const response = { data: results, idPed: pedidoId, q: preference_id };
      res.status(200).json(response);
    }
  );
});

module.exports = router;