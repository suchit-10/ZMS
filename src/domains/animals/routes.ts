import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  AnimalParamsSchema,
  AnimalsQuerySchema,
  AnimalParams,
  AnimalsQuery
} from './dto';
import { AnimalService } from './service';

const animalRouter = Router();

// GET /:id - Get animal by ID
animalRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<AnimalParams>(req.params, AnimalParamsSchema);
  
  if (!paramsValidation.success) {
    res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return;
  }

  try {
    const { id } = paramsValidation.data!;
    const animal = await AnimalService.getAnimalById(id);
    
    if (!animal) {
      res.status(404).json({
        message: 'Animal not found'
      });
      return;
    }

    res.json({
      message: 'Animal retrieved successfully',
      data: animal
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve animal',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET / - Get all animals
animalRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<AnimalsQuery>(req.query, AnimalsQuerySchema);
  
  if (!queryValidation.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return;
  }

  try {
    const { page = 1, limit = 10, species, search } = queryValidation.data!;
    const result = await AnimalService.getAllAnimals(page, limit, species, search);
    
    res.json({
      message: 'Animals retrieved successfully',
      data: result.animals,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve animals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default animalRouter;