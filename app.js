import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import {ValidationError, UniqueConstraintError} from "sequelize"

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter); 

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: err.message, errors: err.errors });
  }
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
