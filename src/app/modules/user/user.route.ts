import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { auth } from "../../helper/auth";
import { UserRole } from "@prisma/client";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth(UserRole.PATIENT), UserControllers.getAllUserDb);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createPatient(req, res, next);
  }
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  // auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.parse(req.body.data));
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createDoctor(req, res, next);
  }
);

export const userRoutes = router;
