import { Router } from "express";
import { onboardAnimal } from "./onboard.controller";
import multer from 'multer'
import path from 'path'
import type { Request } from 'express'

const router = Router();

// store uploads in project-root/uploads
const storage = multer.diskStorage({
	// keep types implicit to satisfy multer's definitions
	destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads')),
	filename: (req, file, cb) => {
		const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
		cb(null, safe)
	}
})

const upload = multer({ storage })

// Accept a single file named `file` alongside JSON fields (animal, enclosure, dietPlan)
// frontend sends the file with key 'file' (FormData.append('file', file))
router.post("/", upload.single('file'), onboardAnimal);

export default router;
