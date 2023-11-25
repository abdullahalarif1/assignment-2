import { Schema, model } from "mongoose";
import {
  IUser,
  IUserAddress,
  IUserOrders,
  // IUserOrders,
  IUsername,
  UserModel,
} from "./user/user.interface";
import bcrypt from "bcrypt";
import config from "../config/config";

const userNameSchema = new Schema<IUsername>(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
  },
  { _id: false }
);

const userAddressSchema = new Schema<IUserAddress>(
  {
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
  },
  { _id: false }
);

const userOrdersSchema = new Schema<IUserOrders>(
  {
    productName: {
      type: String,
      required: [true, "productName is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
  },
  { _id: false }
);

// parent schema --->
const userSchema = new Schema<IUser, UserModel>({
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
    select: false,
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
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    required: [true, "isActive is required"],
  },
  hobbies: { type: [String], default: [], trim: true },
  address: userAddressSchema,
  orders: { type: [userOrdersSchema] },
});

// data control middleware
userSchema.pre("save", async function (next) {
  // hashing
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  console.log(this.password);
  next();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.post("save", async function (doc: any, next) {
  // Completely removing the password field from the document
  console.log(doc);
  doc.password = undefined;
  doc.orders = undefined;
  doc.__v = undefined;

  next();
});

//retrieve the necessary information.
userSchema.pre("find", async function (next) {
  this.select("username fullName age email address");

  next();
});

userSchema.pre("updateOne", async function (next) {
  // Exclude the password field from the update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: any = this.getUpdate();
  if (update && update.$set && update.$set.password) {
    delete update.$set.password;
  }
  next();
});

//eslint-disable-next-line @typescript-eslint/no-explicit-any

// creating a custom static method
userSchema.statics.isUserExists = async function (userId: number) {
  const existingUser = await User.findOne({ userId });

  return existingUser;
};

// /// query middleware
// userNameSchema.pre("find");

export const User = model<IUser, UserModel>("User", userSchema);
