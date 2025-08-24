import api from "../lib/http-client";

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  };
}

export const authService = {
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await api.post<SignInResponse>("/v1/auth/signin", data);
    return response;
  },

  // Add more auth methods as needed
  // resetPassword: async (token: string, password: string) => { ... },
};
