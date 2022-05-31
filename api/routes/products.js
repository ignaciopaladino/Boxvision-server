const express = require("express");
const router = express.Router();

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
  db.query(
    "SELECT product.*," +
      "CONCAT('Esfera Uno ',rangograduacion.esferaunodesde ,'-', rangograduacion.esferaunohasta," +
      "',Cilindro Uno ',rangograduacion.cilindrounodesde,'-',rangograduacion.cilindrounohasta," + 
      "' // Esfera Dos ',rangograduacion.esferadosdesde ,'-', rangograduacion.esferadoshasta," +
      "',Cilindro Dos ',rangograduacion.cilindrodosdesde,'-',rangograduacion.cilindrodoshasta)" +
      " AS 'graduaciondesc',tipolenteprod.nombre as 'tipolente' FROM product " +
      "LEFT OUTER JOIN rangograduacion ON product.rangograduacion = rangograduacion.id " +
      "LEFT OUTER JOIN product as tipolenteprod ON product.idTipoLente = tipolenteprod.id ",
    function selectProducts(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id == "tipolentes") {
    db.query(
      "SELECT product.id as 'value', product.nombre as 'label',product.rangograduacion,product.precio," +
        "CONCAT('Esfera Uno ',rangograduacion.esferaunodesde ,'-', rangograduacion.esferaunohasta," +
        "',Cilindro Uno ',rangograduacion.cilindrounodesde,'-',rangograduacion.cilindrounohasta," +
        "' // Esfera Dos ',rangograduacion.esferadosdesde ,'-', rangograduacion.esferadoshasta," +
        "',Cilindro Dos ',rangograduacion.cilindrodosdesde,'-',rangograduacion.cilindrodoshasta)" +
        "AS 'graduaciondesc' FROM product " +
        "LEFT OUTER JOIN rangograduacion ON product.rangograduacion = rangograduacion.id WHERE tipo = 'lente' " +
        "ORDER BY product.precio ASC",
      function selectProducts(err, results, fields) {
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }
        const response = { data: results };
        res.status(200).json(response);
      }
    );
  } else if (id == "antireflejo") {
    let idTipoLente = req.query.idTipoLente;
    db.query(
      "SELECT product.id as 'value', product.nombre as 'label', product.precio FROM product " +
        "WHERE tipo = 'antireflejo' AND idTipoLente = " +
        idTipoLente +
        " ORDER BY product.precio ASC",
      function selectProducts(err, results, fields) {
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }
        const response = { data: results };
        res.status(200).json(response);
      }
    );
  } else if (id == "fotocromatico") {
    let idTipoLente = req.query.idTipoLente;
    db.query(
      "SELECT product.id as 'value', product.nombre as 'label', product.precio FROM product " +
        "WHERE tipo = 'fotocromatico' AND idTipoLente = " +
        idTipoLente +
        " ORDER BY product.precio ASC",
      function selectProducts(err, results, fields) {
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }
        const response = { data: results };
        res.status(200).json(response);
      }
    );
  } else if (id == "marcos") {
    db.query(
      "SELECT * FROM product " +
        "WHERE tipo = 'marco' " +
        " ORDER BY product.precio ASC",
      function selectProducts(err, results, fields) {
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }
        const response = { data: results };
        res.status(200).json(response);
      }
    );
  } else {
    //Get product by id
    db.query("SELECT * FROM product WHERE id = " + id, function selectProducts(
      err,
      results,
      fields
    ) {
      if (err) {
        console.log("Error: " + err.message);
        throw err;
      }
      res.send(results);
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  //Update product
  const product = {
    id: req.body.values.id,
    nombre: req.body.values.nombre,
    precio: req.body.values.precio,
    tipo: req.body.values.tipo,
    rangograduacion: req.body.values.rangograduacion,
    idTipoLente: req.body.values.idTipoLente,
    label: req.body.values.label
  };

  db.query(
    "UPDATE `product` " +
      "SET `nombre` = ?," +
      "`precio` = ?," +
      "`tipo` = ?," +
      "`rangograduacion` = ?," +
      "`idTipoLente` = ?," +
      "`label` = ?" +
      " WHERE id = ?",
    [
      product.nombre,
      product.precio,
      product.tipo,
      product.rangograduacion,
      product.idTipoLente,
      product.label,
      product.id
    ],
    function updateProduct(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);

        res.status(500).json({ error: err });
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.delete("/:productId", (req, res, next) => {
  //Delete product
  const prodid = req.params.productId;
  db.query(
    "DELETE FROM `product` WHERE id = ?",
    [prodid],
    function DeleteProduct(err, results, fields) {
      if (err) {
        console.log("Error: " + err.message);
        res.status(500).json({ error: err });
      }
      const response = { data: results };
      res.status(200).json(response);
    }
  );
});

router.post("/", (req, res, next) => {
  //Create product
  const product = {
    nombre: req.body.values.nombre,
    precio: req.body.values.precio,
    tipo: req.body.values.tipo,
    rangograduacion: req.body.values.rangograduacion,
    label: req.body.values.label,
    idTipoLente: req.body.values.idTipoLente
  };

  db.query(
    "INSERT INTO `product`(`nombre`, `precio`, `tipo`,`rangograduacion`,`label`,`idTipoLente`) VALUES (?,?,?,?,?,?)",
    [
      product.nombre,
      product.precio,
      product.tipo,
      product.rangograduacion,
      product.label,
      product.idTipoLente
    ],
    function addProduct(err, results, fields) {
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
