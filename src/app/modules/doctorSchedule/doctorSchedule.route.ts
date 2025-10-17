import express, { NextFunction, Request, Response } from "express";
import { doctorScheduleControllers } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../helper/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema
  ),
  doctorScheduleControllers.addDoctorSchedule
);
export const doctorScheduleRoutes = router;
