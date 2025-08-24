import { Router } from "express";
import { onboardAnimal } from "./onboard.controller";

const router = Router();

// Accept a single file named `file` alongside JSON fields (animal, enclosure, dietPlan)
// frontend sends the file with key 'file' (FormData.append('file', file))
router.post("/", onboardAnimal);

export default router;
