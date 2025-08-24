
import { ErrorBoundary } from './ErrorBoundary'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="zms-ui-theme">
        <AuthProvider>
          <Layout>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
                <Route path="/" element= { <ProtectedRoute> <Home/></ProtectedRoute>} />
              
            </Routes>
          </BrowserRouter>
        </Layout>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
