import { Request, Response } from "express";
import { onboardService } from "./onboard.services";
import { AuthenticatedRequest } from "../../middleware/jwt";
import { validateData } from "../../core/validation";
import { OnboardRequest, OnboardSchema } from "./onboard.types";

export const onboardAnimal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // If multer attached a file, include the saved path/filename in the incoming payload
  if ((req as any).file && req.body) {
      // ensure body has animal object
      try {
        // body might have been sent as JSON string fields; try to parse if needed
        if (typeof req.body === 'object') {
          // ok
        }
      } catch (e) {}

      // If fields were sent as JSON strings (FormData), try to parse them
      try {
        if (typeof req.body.animal === 'string') req.body.animal = JSON.parse(req.body.animal)
        if (typeof req.body.enclosure === 'string') req.body.enclosure = JSON.parse(req.body.enclosure)
        if (typeof req.body.dietPlan === 'string') req.body.dietPlan = JSON.parse(req.body.dietPlan)
      } catch(e) {
        // ignore parse errors; validation will catch issues
      }

      if (!req.body.animal) req.body.animal = {};
      // store relative uploads path
  const filename = ((req as any).file as any).filename || '';
      req.body.animal.images = `/uploads/${filename}`;
    }
    // coerce numeric fields that may arrive as strings
    if (req.body.animal && typeof req.body.animal.age === 'string') req.body.animal.age = Number(req.body.animal.age)
  if (req.body.animal && typeof req.body.animal.weight === 'string') req.body.animal.weight = Number(req.body.animal.weight)
    if (req.body.enclosure && typeof req.body.enclosure.temperatureMinCelsius === 'string') req.body.enclosure.temperatureMinCelsius = Number(req.body.enclosure.temperatureMinCelsius)
    if (req.body.enclosure && typeof req.body.enclosure.temperatureMaxCelsius === 'string') req.body.enclosure.temperatureMaxCelsius = Number(req.body.enclosure.temperatureMaxCelsius)
    if (req.body.dietPlan && typeof req.body.dietPlan.totalCaloriesPerDay === 'string') req.body.dietPlan.totalCaloriesPerDay = Number(req.body.dietPlan.totalCaloriesPerDay)
    if (req.body.dietPlan && typeof req.body.dietPlan.feedingFrequencyPerDay === 'string') req.body.dietPlan.feedingFrequencyPerDay = Number(req.body.dietPlan.feedingFrequencyPerDay)

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
