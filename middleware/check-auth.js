const jwt = require("jsonwebtoken");
const SECRET_KEY = "hmS8VVn7r9";
module.exports = (req, res, next) => {
  try {
    console.log("AUTH " + req.headers.authorization.split(" ")[1]);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userData = decoded;
    console.log("OK");
    next();
  } catch (error) {
    console.log("FAILED");

    var appData = {};
    appData.error = 1;
    appData["data"] = "Auth Failed";
    res.send(appData);
  }
};
