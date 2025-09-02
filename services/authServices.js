import User from "../db/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError";

const { JWT_SECRET } = process.env;

export const register = async (email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ email, password: hashPassword });
};

export const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  user.token = token;
  await user.save();
  return user;
};
