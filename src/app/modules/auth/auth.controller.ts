import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.login(req.body);
    const { accesstoken, refreshtoken, needPasswordChange } = result;

    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60
    });

    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 90
    });

    sendResponse(res, {
      success: true,
      data: {
        needPasswordChange,
      },
      statusCode: 200,
      message: "User Logged In Successfully.",
    });
  }
);

export const AuthControllers = {
  login,
};
