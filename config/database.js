const mongoose = require("mongoose");
const mysql = require("mysql");

var db = mysql.createConnection({
  user: "boxvisio_userdev_tablets",
  password: "lKsb^QDvpg}X",
  host: "190.105.227.203",
  port: "3306"
});

db.query("USE boxvisio_db_tablets_dev");

module.exports = db;