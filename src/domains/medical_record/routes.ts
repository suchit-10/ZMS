import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  MedicalRecordSchema,
  MedicalRecordParamsSchema,
  AnimalMedicalRecordsQuerySchema,
  MedicalRecordRequest,
  MedicalRecordParams,
  AnimalMedicalRecordsQuery
} from './dto';
import { MedicalRecordService } from './service';

const medicalRecordRouter = Router();

// POST / - Create new medical record
medicalRecordRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const bodyValidation = validateData<MedicalRecordRequest>(req.body, MedicalRecordSchema);
  
  if (!bodyValidation.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: bodyValidation.errors
    });
    return;
  }

  try {
    const medicalRecord = await MedicalRecordService.createMedicalRecord(bodyValidation.data!);
    
    res.status(201).json({
      message: 'Medical record created successfully',
      data: medicalRecord,
      createdBy: req.claims
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create medical record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /:id - Get medical record by ID
medicalRecordRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<MedicalRecordParams>(req.params, MedicalRecordParamsSchema);
  
  if (!paramsValidation.success) {
    res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return;
  }

  try {
    const { id } = paramsValidation.data!;
    const medicalRecord = await MedicalRecordService.getMedicalRecordById(id);
    
    if (!medicalRecord) {
      res.status(404).json({
        message: 'Medical record not found'
      });
      return;
    }

    res.json({
      message: 'Medical record retrieved successfully',
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve medical record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /by-animal - Get all medical records by animal ID
medicalRecordRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<AnimalMedicalRecordsQuery>(req.query, AnimalMedicalRecordsQuerySchema);
  
  if (!queryValidation.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return;
  }

  try {
    const { animal_id, page = 1, limit = 10 } = queryValidation.data!;
    const result = await MedicalRecordService.getMedicalRecordsByAnimalId(animal_id, page, limit);
    
    res.json({
      message: 'Medical records retrieved successfully',
      data: result.medicalRecords,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve medical records',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default medicalRecordRouter;