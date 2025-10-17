import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";
import { IJWTUser } from "../types/common";

const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.insertIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
      message: "Schedule Added Successfully.",
    });
  }
);

const schedulesForDoctor = catchAsync(
  async (req: Request & {user?:IJWTUser}, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user;
    const result = await ScheduleServices.schedulesForDoctor(user as IJWTUser, options, fillters);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result.data,
      meta: result.meta,
      message: "Schedule Added Successfully.",
    });
  }
);

const deleteSchedules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.deleteSchedules(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
      message: "Schedule deleted Successfully.",
    });
  }
);

export const ScheduleControllers = {
  insertIntoDB,
  schedulesForDoctor,
  deleteSchedules,
};
