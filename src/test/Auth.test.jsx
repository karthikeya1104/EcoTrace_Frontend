import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, mockUser, mockAuthContext } from '../test/test-utils'
import useAuth from '../utils/useAuth'
import Login from '../pages/Login'
import ProtectedRoute from '../auth/ProtectedRoute'

// Mock the auth hook
vi.mock('../utils/useAuth')

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('useAuth Hook', () => {
    it('returns correct initial state', () => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        loading: false
      })

      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.loading).toBe(false)
      expect(typeof result.current.login).toBe('function')
      expect(typeof result.current.logout).toBe('function')
    })

    it('returns authenticated state when user is logged in', () => {
      useAuth.mockReturnValue(mockAuthContext)

      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Login Component', () => {
    it('renders login form', () => {
      useAuth.mockReturnValue({
        ...mockAuthContext,
        isAuthenticated: false
      })

      renderWithRouter(<Login />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('handles successful login', async () => {
      const mockLogin = vi.fn().mockResolvedValue(undefined)
      useAuth.mockReturnValue({
        ...mockAuthContext,
        isAuthenticated: false,
        login: mockLogin
      })

      renderWithRouter(<Login />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('displays error message on login failure', async () => {
      const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
      useAuth.mockReturnValue({
        ...mockAuthContext,
        isAuthenticated: false,
        login: mockLogin
      })

      renderWithRouter(<Login />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'wrongpassword')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })

    it('redirects authenticated users', () => {
      useAuth.mockReturnValue(mockAuthContext)

      renderWithRouter(<Login />)

      // Should redirect, so login form shouldn't be visible
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    })
  })

  describe('ProtectedRoute Component', () => {
    it('renders children for authenticated users with correct role', () => {
      useAuth.mockReturnValue(mockAuthContext)

      renderWithRouter(
        <ProtectedRoute role="manufacturer">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('redirects unauthenticated users', () => {
      useAuth.mockReturnValue({
        ...mockAuthContext,
        isAuthenticated: false
      })

      renderWithRouter(
        <ProtectedRoute role="manufacturer">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('redirects users with incorrect role', () => {
      useAuth.mockReturnValue({
        ...mockAuthContext,
        user: { ...mockUser, role: 'transporter' }
      })

      renderWithRouter(
        <ProtectedRoute role="manufacturer">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('shows loading state during authentication check', () => {
      useAuth.mockReturnValue({
        ...mockAuthContext,
        loading: true
      })

      renderWithRouter(
        <ProtectedRoute role="manufacturer">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })
})