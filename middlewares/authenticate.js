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
      let message = "Not authorized";

    if (error.name === "TokenExpiredError") {
      message = "Token expired, please log in again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token format";
    } else if (error.name === "NotBeforeError") {
      message = "Token not active yet";
    }

    return next(HttpError(401, message));
  }

  const user = await User.findOne({ where: { id: payload.id } });
  if (!user || user.token !== token) {
   next(HttpError(401));
  }
  req.user = user;
  next();
};

export default authenticate;