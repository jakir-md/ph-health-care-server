import express, { NextFunction, Request, Response } from "express";
import { doctorControllers } from "./doctor.controller";

const router = express.Router();

router.get("/", doctorControllers.getAllDoctorsFromDb);
router.patch("/:id", doctorControllers.updateDoctorInDb);
export const doctorRoutes = router;
