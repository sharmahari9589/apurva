const jwt = require("jsonwebtoken");
const config = require("../../config");
require('dotenv').config()

const { message, response } = require("../../utils/response");


exports.ensureWebToken = async (req, res, next) => {
  const x_access_token = req.headers["authorization"];
  if (x_access_token) {
      req.token = x_access_token.replace("Bearer ", "");
      verifyJWT(req, res, next);
  } else {
      res.status(401).json(response(false, "Unauthorized"));
  }
}

  var verifyJWT= async(req, res, next) =>{
    const token = req.token;
    jwt.verify(token, process.env.JWTSECRETKEY, async function (err, data) {
      if (err) {
        console.log(err.message,"dd");
        res.status(401)
      .send(response(false, "Unauthorized"));

      } else {
        const _data = await jwt.decode(req.token, {
          complete: true,
          json: true,
        });
        req.user = _data["payload"];
        req.userId = req.user.id;
        req.email = req.user.email;
        req.bnb_address = req.user.bnb_address;
        next();
      }
    });
  }