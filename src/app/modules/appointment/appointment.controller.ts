import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentServices } from "./appointment.service";
import { IJWTUser } from "../types/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJWTUser }, res: Response) => {
    const user = req.user;
    const result = await appointmentServices.createAppointment(
      user as IJWTUser,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments Created successfully!",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
};
