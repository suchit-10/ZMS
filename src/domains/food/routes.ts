import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  FeedingRecordSchema,
  FeedingRecordParamsSchema,
  AnimalFeedingRecordsQuerySchema,
  FeedingRecordRequest,
  FeedingRecordParams,
  AnimalFeedingRecordsQuery
} from './dto';
import { FeedingRecordService } from './service';

const feedingRecordRouter = Router();

// POST / - Create new feeding record
feedingRecordRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const bodyValidation = validateData<FeedingRecordRequest>(req.body, FeedingRecordSchema);
  const userId = req.claims?.user_id;
  
  if (!bodyValidation.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: bodyValidation.errors
    });
    return;
  }

  try {
    const feedingRecord = await FeedingRecordService.createFeedingRecord(bodyValidation.data!, userId!);
    
    res.status(201).json({
      message: 'Feeding record created successfully',
      data: feedingRecord,
      createdBy: req.claims
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create feeding record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /:id - Get feeding record by ID
feedingRecordRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<FeedingRecordParams>(req.params, FeedingRecordParamsSchema);
  
  if (!paramsValidation.success) {
    res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return;
  }

  try {
    const { id } = paramsValidation.data!;
    const feedingRecord = await FeedingRecordService.getFeedingRecordById(id);
    
    if (!feedingRecord) {
      res.status(404).json({
        message: 'Feeding record not found'
      });
      return;
    }

    res.json({
      message: 'Feeding record retrieved successfully',
      data: feedingRecord
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve feeding record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET / - Get all feeding records by animal ID
feedingRecordRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<AnimalFeedingRecordsQuery>(req.query, AnimalFeedingRecordsQuerySchema);
  
  if (!queryValidation.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return;
  }

  try {
    const { animal_id, page = 1, limit = 10 } = queryValidation.data!;
    const result = await FeedingRecordService.getFeedingRecordsByAnimalId(animal_id, page, limit);
    
    res.json({
      message: 'Feeding records retrieved successfully',
      data: result.feedingRecords,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve feeding records',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default feedingRecordRouter;