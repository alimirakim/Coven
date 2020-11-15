const jwt = require("jsonwebtoken");
const { jwtConfig } = require('./config');
const { User } = require('./db/models');
const bearerToken = require('express-bearer-token');

const { secret, expiresIn } = jwtConfig;

const makeUserToken = (user) => {
  const data = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(data, secret,{ expiresIn: parseInt(expiresIn, 10) })
  return token;
};


const restoreUser = (req, res, next) => {
  console.log("\nAUTH AUTH")
  const { token } = req
  console.log("TOKEN", token)
  if (!token) {
    return res.set("WWW-Authenticate", "Bearer").status(401).end()
  }
  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      err.status = 401
      return next(err)
    }
    console.log("\nPAYLOAD", jwtPayload)
    const { id } = jwtPayload
    try {
      req.user = await User.findByPk(id)
    } catch (err) {
      return next(err)
    }
    if (!req.user) {
      return res.set("WWW-Authenticate", "Bearer").status(401).end();
    }
    return next();
  });
};

const requireAuth = [bearerToken(), restoreUser];
module.exports = { makeUserToken, requireAuth };
