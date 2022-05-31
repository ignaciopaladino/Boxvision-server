const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "hmS8VVn7r9";

var db = mysql.createConnection({
  user: "boxvisio_user",
  password: "Svp5j-48VEcJ",
  host: "190.105.227.203",
  port: "3306"
});

db.query("USE boxvisio_db");

router.post("/signupadmin", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else {
      console.log("hash: " + hash);
      console.log("user: " + req.body.user);

      db.query(
        "INSERT INTO `adminuser`(`username`, `password`) VALUES (" +
          '"' +
          req.body.user +
          '","' +
          hash +
          '")',
        function(err, rows, field) {
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }
          return res.status(200).json({ message: "Signup Success" });
        }
      );
    }
  });
});

router.post("/", (req, res) => {
  var appData = {};

  var user = req.body.user;
  console.log(user.usuario);
  db.query(
    "SELECT * FROM adminuser WHERE username = ?",
    [user.usuario],
    function(err, rows, fields) {
      if (err) {
        appData.error = 1;
        appData["data"] = "Error Occured!";
        res.send(appData);
      } else {
        if (rows.length > 0) {
          bcrypt.compare(user.password, rows[0].password, (err, result) => {
            console.log("error " + err);
            console.log("result " + result);
            if (err) {
              appData.error = 1;
              appData["data"] = "Auth Success";

              res.send(appData);
            }

            if (result) {
              token = jwt.sign({ user: rows[0].username }, SECRET_KEY, {
                expiresIn: 3600 * 12
              });
              appData.error = 0;
              appData["data"] = "Auth Success";
              appData["token"] = token;
              appData["expiresIn"] = 3600 * 12;
              res.send(appData);
            } else {
              appData.error = 1;
              appData["data"] = "Auth Failed";
              res.send(appData);
            }
          });
        } else {
          appData.error = 1;
          appData["data"] = "Auth Failed";
          res.send(appData);
        }
      }
    }
  );
});
module.exports = router;
