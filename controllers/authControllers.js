import { register, login } from "../services/authServices";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import HttpError from "../helpers/HttpError.js";

export const registerController = async (req, res, next) => {
  const { username, email, password } = req.body;
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.details[0].message));
  }
  try {
    const newUser = await register(username, email, password);
    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.details[0].message));
  }
  try {
    const user = await login(email, password);
    res.status(200).json({
      token: user.token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};
