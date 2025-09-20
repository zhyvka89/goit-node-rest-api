import User from "../db/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import gravatar from "gravatar";
import fs from "node:fs/promises";
import { sendEmail } from "../helpers/sendEmail.js";
import "dotenv/config";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const createVerifyEmail = ({ verificationToken, email }) => ({
  to: email,
  subject: "Verify email",
  html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
});

export const register = async (username, email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(email, { s: "250", d: "retro" });
  const verificationToken = nanoid();
  const verifyEmail = createVerifyEmail({verificationToken, email});

  await sendEmail(verifyEmail);

  return User.create({
    username,
    email,
    password: hashPassword,
    avatarURL: avatar,
    verificationToken,
  });
};

export const resendVerifyUser = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.verify) {
    throw HttpError(401, "User not found or already verified");
  }

  const verifyEmail = createVerifyEmail({
    verificationToken: user.verificationToken,
    email,
  });
  await sendEmail(verifyEmail);
};

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    throw HttpError(404, "User not found or already verifed");
  }

  await user.update({ verify: true, verificationToken: null });
};

export const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if(!user.verify) {
    throw HttpError(401, "Email not verified");
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

export const logout = async (id) => {
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return null;
  }
  await user.update({ token: null });
  return true;
};

export const uploadAvatar = async (id, file) => {
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return null;
  }
  let avatar = null;
  if (file) {
    const newPath = path.join(avatarsDir, file.filename);
    await fs.rename(file.path, newPath);
    avatar = path.join("avatars", file.filename);
  }
  await user.update({ avatarURL: avatar });
  return user;
};
