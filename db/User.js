import { DataTypes } from "sequelize";

import sequelize from "./sequelize.js";

const User = sequelize.define(
  'user', {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ["starter", "pro", "business"],
      defaultValue: "starter"
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    avatarURL: {
      type: DataTypes.STRING,
    }
  }
)

// User.sync({ alter: true });

export default User;