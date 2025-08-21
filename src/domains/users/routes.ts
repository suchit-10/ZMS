import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  UserParamsSchema, 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserQuerySchema,
  UserParams,
  CreateUserRequest,
  UpdateUserRequest,
  UserQuery 
} from './dto';

const userRouter = Router();

userRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<UserQuery>(req.query, UserQuerySchema);
  
  if (!queryValidation.success) {
     res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return
  }

  const { page = 1, limit = 10, search } = queryValidation.data!;
  
  res.json({ 
    message: 'Get all users', 
    user: req.claims,
    pagination: { page, limit },
    search 
  });
});

userRouter.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<UserParams>(req.params, UserParamsSchema);
  
  if (!paramsValidation.success) {
     res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return
  }

  const { userId } = paramsValidation.data!;
  res.json({ message: `Get user ${userId}`, user: req.claims });
});

userRouter.post('/', (req: AuthenticatedRequest, res: Response) => {
  const bodyValidation = validateData<CreateUserRequest>(req.body, CreateUserSchema);
  
  if (!bodyValidation.success) {
     res.status(400).json({
      message: 'Validation failed',
      errors: bodyValidation.errors
    });
    return
  }

  const { username, email, password } = bodyValidation.data!;
  
  res.json({ 
    message: 'User created successfully',
    user: { username, email },
    createdBy: req.claims
  });
});

userRouter.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<UserParams>(req.params, UserParamsSchema);
  const bodyValidation = validateData<UpdateUserRequest>(req.body, UpdateUserSchema);
  
  if (!paramsValidation.success) {
     res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return
  }
  
  if (!bodyValidation.success) {
    
     res.status(400).json({
      message: 'Validation failed',
      errors: bodyValidation.errors
    });
    return
  }

  const { userId } = paramsValidation.data!;
  const updateData = bodyValidation.data!;
  
  res.json({ 
    message: `User ${userId} updated successfully`,
    updateData,
    updatedBy: req.claims
  });
});

userRouter.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const paramsValidation = validateData<UserParams>(req.params, UserParamsSchema);
  
  if (!paramsValidation.success) {
     res.status(400).json({
      message: 'Invalid parameters',
      errors: paramsValidation.errors
    });
    return
  }

  const { userId } = paramsValidation.data!;
  res.json({ 
    message: `User ${userId} deleted successfully`,
    deletedBy: req.claims
  });
});

export default userRouter;