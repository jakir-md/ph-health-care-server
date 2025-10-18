import express, { NextFunction, Request, Response } from "express";
import { appointmentController } from "./appointment.controller";
import { auth } from "../../helper/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  appointmentController.createAppointment
);

export const appointmentRoutes = router;
