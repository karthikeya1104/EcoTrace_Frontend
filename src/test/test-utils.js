import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Custom render function that includes router context
export const renderWithRouter = (component, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )

  return render(component, { wrapper: Wrapper, ...options })
}

// Mock user data
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  role: 'manufacturer',
  company_name: 'Test Company'
}

// Mock auth context
export const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false
}

// Mock API responses
export const mockApiResponse = {
  success: (data) => ({ data, status: 200 }),
  error: (message, status = 400) => ({
    error: { message },
    status
  })
}

// Mock axios
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(() => mockAxios),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
}

// Helper to create mock products
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Test Product',
  category: 'Electronics',
  sku: 'TEST-001',
  description: 'A test product',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides
})

// Helper to create mock batches
export const createMockBatch = (overrides = {}) => ({
  id: 1,
  product_id: 1,
  quantity: 100,
  status: 'active',
  material_composition: {
    plastic: 30,
    metal: 50,
    electronics: 20
  },
  manufacturing_date: '2024-01-15',
  expiry_date: '2026-01-15',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides
})

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Custom matchers
export const customMatchers = {
  toBeVisible: () => ({
    message: () => 'expected element to be visible',
    pass: (element) => element && !element.hidden
  })
}