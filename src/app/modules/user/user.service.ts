import { User } from "./../user.model";
import { IUser } from "./user.interface";

const createUserIntoDB = async (user: IUser) => {
  const result = await User.create(user);
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleStudentFromDB = async (userId: string) => {
  const result = await User.findOne({ userId });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleStudentFromDB,
};
