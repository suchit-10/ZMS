import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import PasswordToggle from "../components/PasswordToggle";

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const { setUserAndToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleEmailSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authService.signIn({
        email: data.email,
        password: data.password,
      });

      // Update user state through context
      setUserAndToken(result.data.user, result.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100"
      style={{
        background:
          "linear-gradient(135deg, #eaf6ef 0%, #f8fff8 50%, #e6f4e6 100%)",
      }}
    >
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          {/* logo + title */}
          <img
            src="/images/logo-128.svg"
            alt="Zoo Logo"
            className="mx-auto h-20 w-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">
            Zoo Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit(handleEmailSubmit)}
          className="space-y-6 bg-white/90 p-6 rounded-lg shadow-md backdrop-blur-sm border border-white/30"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b6e3a] focus:border-transparent"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b6e3a] focus:border-transparent"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1b6e3a] hover:bg-[#145a2e] disabled:bg-[#97caa0] text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#1b6e3a] focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
