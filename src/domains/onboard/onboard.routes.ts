import { Router } from "express";
import { onboardAnimal } from "./onboard.controller";

const router = Router();

router.post("/", onboardAnimal);

export default router;
