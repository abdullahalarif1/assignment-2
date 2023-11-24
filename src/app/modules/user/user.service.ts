/* eslint-disable no-unused-vars */
import { User } from "./../user.model";
import { IUser } from "./user.interface";

const createUserIntoDB = async (userData: IUser) => {
  // static method
  if (await User.isUserExists(userData.userId)) {
    throw new Error("User already exists");
  }

  // const { orders, ...userDataWithoutOrdersAndV } = userData;
  // const user = new User(userDataWithoutOrdersAndV);
  // const result = await user.save();
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
  const result = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
};
