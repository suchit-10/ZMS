
import { Router, Request, Response } from 'express';
import { validateData } from '../../core/validation';
import { SignInSchema, CreateUserSchema, SignInRequest, CreateUserRequest } from '../users/dto';
import { authenticateUser, createUser } from '../users/service';
import { GenerateTokenPayload, TokenPayload } from '../../middleware/jwt';

const authRouter = Router();

authRouter.post('/signin', async (req: Request, res: Response) =>  {
  const validation = validateData<SignInRequest>(req.body, SignInSchema);
  
  if (!validation.success) {
     res.status(400).json({
      message: 'Validation failed',
      errors: validation.errors
    });
    return 
  }

   const {success, user, error} =  await authenticateUser(validation.data!)
    if(error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error,

    })
    return;
  }
  const payload:TokenPayload = {
    user_id: user?.id?.toString(),
    email:user?.email,
    username:user?.username,

  }
  const token = GenerateTokenPayload(payload)


  res.json({
    message:"authenticated successfully",
    data:{
      token: token,
      user: user
    }
  })
  
});

authRouter.post('/signup', async (req: Request, res: Response) => {
  const validation = validateData<CreateUserRequest>(req.body, CreateUserSchema);
  
  if (!validation.success) {
     res.status(400).json({
      message: 'Validation failed',
      errors: validation.errors
    });
    return
  }

   const { success, user ,error } =  await createUser(validation.data!)
   if(error) {
    res.status(500).json({
      message: "error while creating user",
      error: error,

    })
   }
  
  res.json({ 
    message: 'User registered successfully',
    data: user
  });
});

export default authRouter;