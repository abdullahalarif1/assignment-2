/* eslint-disable no-unused-vars */
import { User } from "./../user.model";
import { IUser, IUserOrders } from "./user.interface";
import UserValidationSchema from "./user.validation";

const createUserIntoDB = async (userData: IUser) => {
  // static method
  if (await User.isUserExists(userData.userId)) {
    throw new Error("User already exists");
  }

  const result = await User.create(userData);

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();

  return result;
};

const getSingleUserFromDB = async (userId: number) => {
  // Use static method to check if the user exists
  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  // Use select method to exclude the password field
  const result = await User.findOne({ userId }).select(
    "-password -orders -__v"
  );
  return result;
};

// delete
const deleteUserFromDB = async (userId: number) => {
  // Use static method to check if the user exists
  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  // Use select method to exclude the password field
  const result = await User.deleteOne({ userId });
  return result;
};

const updateUserFromDB = async (userId: number, userData: Partial<IUser>) => {
  // Use static method to check if the user exists

  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  // Validate the updated data using Joi schema
  const { error } = UserValidationSchema.validate(userData, {
    abortEarly: false, // Collect all validation errors
  });

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);
    throw new Error(`Validation error: ${validationErrors.join(", ")}`);
  }

  const result = await User.updateOne(
    { userId },
    { $set: userData },
    { new: true }
  );
  return result;
};

const addProductIntoOrder = async (
  userId: number,
  productData: IUserOrders
) => {
  // Use static method to check if the user exists
  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  const result = await User.findOneAndUpdate(
    { userId },
    { $push: { orders: productData } },
    { new: true }
  );
  return result;
};

const getOrdersForUser = async (userId: number) => {
  // Use static method to check if the user exists
  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  const result = await User.findOne({ userId });
  if (!result) {
    throw new Error("User not found");
  }
  return result.orders;
};

const totalPriceIntoOrder = async (userId: number) => {
  const result = await User.findOne({ userId });
  // Use static method to check if the user exists
  const userExists = await User.isUserExists(userId);

  if (!userExists) {
    throw new Error("User not found");
  }

  if (!result) {
    throw new Error("User not found");
  }

  const orders = result.orders || [];
  const totalPrice = orders.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0
  );


  return totalPrice;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
  addProductIntoOrder,
  getOrdersForUser,
  totalPriceIntoOrder,
};
