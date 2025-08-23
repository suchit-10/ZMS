import { Request, Response } from "express";
import { onboardService } from "./onboard.services";
import { AuthenticatedRequest } from "@/middleware/jwt";
import { validateData } from "@/core/validation";
import { OnboardRequest, OnboardSchema } from "./onboard.types";

export const onboardAnimal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // const validatedData = validateData<OnboardRequest>(req.body,OnboardSchema)
    const data = await onboardService(req.body);

    res.status(201).json({
      success: true,
      message: "Animal onboarded successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
