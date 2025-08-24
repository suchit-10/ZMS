import { CreateUserRequest, SignInRequest, UserResponse } from './dto';
import { User, IUser } from './model';


async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email: email.toLowerCase() , isActive: true });
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export async function createUser(userData: CreateUserRequest): Promise<{ success: boolean; user?: UserResponse; error?: string }> {
  try {
    const existingUserByEmail = await getUserByEmail(userData.email);
    if (existingUserByEmail) {
      return { success: false, error: 'User with this email already exists' };
    }

    const existingUserByUsername = await User.findOne({ username: userData.username });
    if (existingUserByUsername) {
      return { success: false, error: 'User with this username already exists' };
    }

    const user = new User({
      username: userData.username,
      email: userData.email,
      password: userData.password
    });

    const savedUser = await user.save();
    return { success: true, user: {username:savedUser.username, id: savedUser._id, email: savedUser.email }  };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function authenticateUser(credentials: SignInRequest): Promise<{ success: boolean; user?: UserResponse; error?: string }> {
  try {
    const user = await getUserByEmail(credentials.email);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    return { success: true, user: {id: user._id , username: user.username , email: user.email} };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function getUserById(id: string): Promise<IUser | null> {
  try {
     const user = await User.findById(id).select('-password');
     return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

export async function getAllUsers(page = 1, limit = 10, search?: string): Promise<{
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  try {
    const skip = (page - 1) * limit;
    
    // Build query filter
    const filter: any = { isActive: true };
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Failed to retrieve users');
  }
}