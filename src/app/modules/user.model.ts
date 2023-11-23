import { Schema, model } from "mongoose";
import {
  IUser,
  IUserAddress,
  // IUserOrders,
  IUsername,
} from "./user/user.interface";
import bcrypt from "bcrypt";
import config from "../config/config";

const userNameSchema = new Schema<IUsername>({
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
});

const userAddressSchema = new Schema<IUserAddress>({
  street: {
    type: String,
    required: [true, "street is required"],
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
  country: {
    type: String,
    required: [true, "country is required"],
  },
});

// const userOrdersSchema = new Schema<IUserOrders>({
//   productName: {
//     type: String,
//     required: [true, "productName is required"],
//   },
//   price: {
//     type: Number,
//     required: [true, "price is required"],
//   },
//   quantity: {
//     type: Number,
//     required: [true, "quantity is required"],
//   },
// });

// parent schema --->
const userSchema = new Schema<IUser>({
  userId: {
    type: Number,
    required: [true, "userId is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    maxlength: [20, "Password cannot be more than 20 characters"],
  },
  fullName: {
    type: userNameSchema,
    required: [true, "User name is required"],
  },
  age: {
    type: Number,
    required: [true, "age is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  isActive: {
    type: Boolean,
    required: [true, "isActive is required"],
  },
  hobbies: {
    type: [String],
    enum: {
      values: ["Traveling", "Playing"],
      message: "{VALUE} is not a valid hobby",
    },
    required: [true, "Hobbies are required"],
  },
  address: userAddressSchema,
  // orders: userOrdersSchema,
});

// data control middleware
userSchema.pre("save", async function (next) {
  // hashing
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.post("save", async function (doc, next) {
  // Completely removing the password field from the document
  //  doc.password = ''

  doc.updateOne({ userId: this.userId }, { $unset: { password: 1 } });

  next();
});

export const User = model<IUser>("User", userSchema);
