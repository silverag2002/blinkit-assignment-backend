import httpStatus from "http-status";

import bcrypt from "bcryptjs";

import * as userService from "./user.service";

import ApiError from "../utils/ApiError";

import { loginDetails } from "../models/login.model";

import config from "../config/config";

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

export const isPasswordMatch = async function (password, actualPassword) {
  return bcrypt.compare(password, actualPassword);
};

export const loginUserWithEmailAndPassword = async (email, password) => {
  const login = await loginDetails.findOne({
    email,
  });

  if (!login || !(await isPasswordMatch(password, login.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return loginWithLoginData(login);
};

/**
 * Update user password
 * @param {string} id
 *  @param {string} password
 * @returns {Promise<User>}
 */
export const updateUserPassword = async (id, password) => {
  let hashedPassword = await bcrypt.hash(password, 8);
  return loginDetails.findOneAndUpdate(
    { _id: id },
    { $set: { password: hashedPassword } }
  );
};

/**
 * Login with username and password
 * @param {loginDetails} login
 * @returns {Promise<loginDetails>}
 */
export const createLogin = async (data) => {
  const login = { ...data };
  if (!login.password) {
    // generating some random password
    // login.password = Math.random().toString(36).slice(2)
    login.password = config.default.password;
  }
  if (!login.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Login ID Missing");
  }
  login._id = login.id;
  delete login.id;
  const loginData = await loginDetails.create(login);
  loginData.password = login.password;
  return loginData;
};

const loginWithLoginData = async (login) => {
  const { id, email } = login;

  const user = await userService.getUserByEmail(email);

  return { user, id };
};
