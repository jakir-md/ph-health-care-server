import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorServices } from "./doctor.service";
import {
  doctorFilterableFields,
  doctorSearchAbleFields,
} from "./doctor.constant";
import { NextFunction, Request, Response } from "express";
import { pick } from "../../helper/pick";

const getAllDoctorsFromDb = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, doctorSearchAbleFields);
    const result = await doctorServices.getAllDoctorsFromDb(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
      message: "Doctor Schedule Added Successfully.",
    });
  }
);

const updateDoctorInDb = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await doctorServices.updateDoctorInDb(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})
export const doctorControllers = {
  getAllDoctorsFromDb,
  updateDoctorInDb
};
