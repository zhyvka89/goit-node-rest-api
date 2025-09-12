import { register, login, logout } from "../services/authServices.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
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
        avatarURL: newUser.avatarURL,
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

export const logoutController = async (req, res, next) => {
  try {
    const { user } = req;
    const result = await logout(user.id);
    if (!result) {
      return next(HttpError(401, "Not authorized"));
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const getCurrentController = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};