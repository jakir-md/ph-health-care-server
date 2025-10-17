import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleServices } from "./doctorSchedule.service";
import { IJWTUser } from "../types/common";

const addDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: IJWTUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await doctorScheduleServices.addDoctorSchedule(
      req.user as IJWTUser,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
      message: "Doctor Schedule Added Successfully.",
    });
  }
);

export const doctorScheduleControllers = {
  addDoctorSchedule,
};
