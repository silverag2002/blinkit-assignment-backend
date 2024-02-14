const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");

const { User } = require("../models");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
};

const jwtVerify = async (req, payload, done) => {
  console.log("Request params", req.params);

  console.log("token", payload);

  try {
    const user = await User.findById(payload.id);
    req.user = user;
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
