import express, { NextFunction, Request, Response } from "express";
import { ScheduleControllers } from "./schedule.controller";
import { auth } from "../../helper/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleControllers.schedulesForDoctor
);
router.post("/", ScheduleControllers.insertIntoDB);
router.delete("/:id", ScheduleControllers.deleteSchedules);

export const scheduleRoutes = router;
