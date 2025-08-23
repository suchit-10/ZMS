import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  ObservationSchema,
  ObservationParamsSchema,
  AnimalObservationsQuerySchema,
  ObservationRequest,
  ObservationParams,
  AnimalObservationsQuery
} from './dto';
import { ObservationService } from './service';

const observationRouter = Router();

// POST / - Create new observation
observationRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const bodyValidation = validateData<ObservationRequest>(req.body, ObservationSchema);
  
  if (!bodyValidation.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: bodyValidation.errors
    });
    return;
  }

  try {
    const observation = await ObservationService.createObservation(bodyValidation.data!);
    
    res.status(201).json({
      message: 'Observation created successfully',
      data: observation,
      createdBy: req.claims
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create observation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /:id - Get observation by ID
observationRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<ObservationParams>(req.params, ObservationParamsSchema);
  
  if (!paramsValidation.success) {
    res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return;
  }

  try {
    const { id } = paramsValidation.data!;
    const observation = await ObservationService.getObservationById(id);
    
    if (!observation) {
      res.status(404).json({
        message: 'Observation not found'
      });
      return;
    }

    res.json({
      message: 'Observation retrieved successfully',
      data: observation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve observation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /by-animal - Get all observations by animal ID
observationRouter.get('/by-animal', async (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<AnimalObservationsQuery>(req.query, AnimalObservationsQuerySchema);
  
  if (!queryValidation.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return;
  }

  try {
    const { animal_id, page = 1, limit = 10 } = queryValidation.data!;
    const result = await ObservationService.getObservationsByAnimalId(animal_id, page, limit);
    
    res.json({
      message: 'Observations retrieved successfully',
      data: result.observations,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve observations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default observationRouter;