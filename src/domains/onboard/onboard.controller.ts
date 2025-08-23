import { Request, Response } from "express";
import { onboardService } from "./onboard.services";

export const onboardAnimal = async (req: Request, res: Response) => {
  try {
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
