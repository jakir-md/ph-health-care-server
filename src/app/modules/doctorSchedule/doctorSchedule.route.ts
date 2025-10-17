import express, { NextFunction, Request, Response } from "express";
import { doctorScheduleControllers } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../helper/auth";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.addDoctorSchedule
);
export const doctorScheduleRoutes = router;
