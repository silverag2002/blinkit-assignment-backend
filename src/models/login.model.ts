import { Schema, model, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { DB_COLLECTIONS } from "../utils/constants";
import { LoginType } from "../interfaces/Login";

const loginSchema = new Schema<LoginType>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

loginSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 8);
    this.password = hashedPassword;
  }
  next();
});

/**
 * @typedef loginDetails
 */
export const loginDetails = model<LoginType>(
  DB_COLLECTIONS.LOGIN_DETAILS,
  loginSchema
);
