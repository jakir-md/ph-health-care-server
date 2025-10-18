import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";

const createPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createPatient(req);
    sendResponse(res, {
      success: true,
      data: result,
      statusCode: 201,
      message: "Patient Created Successfully.",
    });
  }
);

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfuly!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created successfuly!",
    data: result,
  });
});

const getAllUserDb = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //page, limit, sortBy, sortOrder, - pagination, sorting
    //fields, searchTerm - searching, filtering

    //these two lines returns object
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); //pagination, sorting
    const filters = pick(req.query, ["status", "role", "email", "searchTerm"]); //searching, filtering

    const result = await UserServices.getAllUserDb(options, filters);
    sendResponse(res, {
      success: true,
      data: result.data,
      meta: result.meta,
      statusCode: 200,
      message: "Users retrieved Successfully.",
    });
  }
);

export const UserControllers = {
  createPatient,
  getAllUserDb,
  createAdmin,
  createDoctor,
};
