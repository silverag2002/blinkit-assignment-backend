import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { authService, userService, tokenService } from "../services";

import { createLogin } from "../services/auth.service";

export const register = catchAsync(async (req, res) => {
  const { password, email } = req.body;

  let userData = await userService.createUser(req.body);

  await createLogin({
    id: userData.id,
    email,
    password,
  });
  const tokens = await tokenService.generateAuthToken(userData);
  res.status(httpStatus.CREATED).send({ userData, tokens });
});

export const loginUserWithEmailAndPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // const { type } = req.params;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthToken(user);
  res.send({ user: user.user, token });
});
