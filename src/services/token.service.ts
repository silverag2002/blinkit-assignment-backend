/* eslint-disable prefer-const */
import jwt from "jsonwebtoken";
import moment from "moment";

import config from "../config/config";

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Object}
 */
export const extractJwtPlayload = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Generate token
 * @param {Object} user
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (user, expires) => {
  const payload = {
    id: user.id,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, config.jwt.secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthToken = async (user) => {
  let generatedTokens = "";

  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  generatedTokens = generateToken(user, accessTokenExpires);

  return generatedTokens;
};
