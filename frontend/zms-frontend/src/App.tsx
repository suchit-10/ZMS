import { ErrorBoundary } from "./ErrorBoundary";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/theme-provider";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Animals from "./pages/Animals";
import AddAnimal from "./pages/AddAnimal";
import AnimalDetails from "./pages/AnimalDetails";
import Users from "./pages/Users";
import { Login } from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastProvider } from "./components/toast/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="zms-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
            <Layout>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/animals"
                    element={
                      <ProtectedRoute>
                        <Animals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/add"
                    element={
                      <ProtectedRoute>
                        <AddAnimal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/animals/:id"
                    element={
                      <ProtectedRoute>
                        <AnimalDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </Layout>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
