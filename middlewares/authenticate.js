import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import User from "../db/User.js";

const authenticate = async (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw HttpError(401, "Authorization header missing");
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401, "Authorization header must have bearer type");
  }

  const { payload, error } = verifyToken(token);
  if (error) {
    throw HttpError(401, error.message);
  }

  const user = await User.findOne({ where: { id: payload.id } });
  if (!user) {
    throw HttpError(401, "User not found");
  }
  req.user = user;
  next();
};

export default authenticate;