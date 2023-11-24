import { Request, Response } from "express";
import { UserServices } from "./user.service";
import UserValidationSchema from "./user.validation";

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;

    // data validation using joi
    const { error } = UserValidationSchema.validate(userData);
    // console.log(error, value);

    if (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
        error: error.details,
      });
    }

    const result = await UserServices.createUserIntoDB(userData);

    res.status(201).json({
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // send response to postman
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong", // show error on //postman
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const parseId = parseInt(req.params.userId);

    const result = await UserServices.getSingleUserFromDB(parseId);

    res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // send response to postman
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong", // show error on //postman
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const parseId = parseInt(req.params.userId);

    await UserServices.deleteUserFromDB(parseId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // send response to postman
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong", // show error on //postman
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const parseId = parseInt(req.params.userId);

    await UserServices.updateUserFromDB(parseId, userData);

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // send response to postman
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong", // show error on //postman
      error: {
        code: 404,
        description: "User not found!",
      },
    });
  }
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
