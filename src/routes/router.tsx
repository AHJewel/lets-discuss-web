import { createBrowserRouter } from 'react-router'
import { StatusPage } from '../features/status/StatusPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DashboardPage, LoginPage } from './pages'

export const router = createBrowserRouter([
  { path: '/', element: <StatusPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
])
