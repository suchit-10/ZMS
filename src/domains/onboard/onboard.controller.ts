import { Request, Response } from "express";
import { onboardService } from "./onboard.services";
import { AuthenticatedRequest } from "../../middleware/jwt";
import { validateData } from "../../core/validation";
import { OnboardRequest, OnboardSchema } from "./onboard.types";

export const onboardAnimal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = validateData<OnboardRequest>(req.body,OnboardSchema)
    if(!data.success) {
      res.status(400).json({
        success:false,
        message: "error while validating request body",
        error:data.errors
      })
      return;
    }

  const response =  await onboardService(data.data!)

    res.status(201).json({
      success: true,
      message: "Animal onboarded successfully",
      data:response,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
