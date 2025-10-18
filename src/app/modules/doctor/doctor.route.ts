import express, { NextFunction, Request, Response } from "express";
import { doctorControllers } from "./doctor.controller";

const router = express.Router();

router.get("/:id", doctorControllers.getDoctorById)
router.get("/", doctorControllers.getAllDoctorsFromDb);
router.patch("/:id", doctorControllers.updateDoctorInDb);
router.post("/ai-suggestions", doctorControllers.getDoctorsAISuggestion);

export const doctorRoutes = router;
