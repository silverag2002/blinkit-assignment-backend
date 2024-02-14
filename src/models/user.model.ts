import { Schema, Model, model } from "mongoose";
import { UserType } from "../interfaces/User";

import { DB_COLLECTIONS } from "../utils/constants";

interface UserModelType extends Model<UserType> {
  isEmailTaken(email: string): Promise<boolean>;
}

const userSchema = new Schema<UserType, UserModelType>(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: false,
    },

    images: {
      type: [String],
      required: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

export const User = model<UserType, UserModelType>(
  DB_COLLECTIONS.USERS,
  userSchema
);
