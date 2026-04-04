import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { renderHook, waitFor } from '@testing-library/react'
import { mockAxios, mockApiResponse } from '../test/test-utils'

// Mock axios
vi.mock('axios')
axios.create.mockReturnValue(mockAxios)

describe('API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Axios Configuration', () => {
    it('creates axios instance with correct config', () => {
      // Import the axios configuration
      require('../api/axios')

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })

    it('adds authorization header when token exists', async () => {
      // Mock localStorage
      const mockToken = 'mock-jwt-token'
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken)

      // Import axios config (this will set up interceptors)
      require('../api/axios')

      // Simulate a request
      const mockConfig = { headers: {} }
      const requestInterceptor = mockAxios.interceptors.request.use.mock.calls[0][0]
      const result = await requestInterceptor(mockConfig)

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
    })

    it('handles 401 responses by clearing token', async () => {
      // Mock localStorage
      const clearSpy = vi.spyOn(Storage.prototype, 'clear')
      const hrefSpy = vi.spyOn(window.location, 'href', 'set')

      // Import axios config
      require('../api/axios')

      // Simulate 401 error
      const mockError = {
        response: { status: 401 },
        config: {}
      }

      const responseInterceptor = mockAxios.interceptors.response.use.mock.calls[0][1]
      await expect(responseInterceptor(mockError)).rejects.toThrow()

      expect(hrefSpy).toHaveBeenCalledWith('/login')
    })
  })

  describe('Authentication API', () => {
    let authAPI

    beforeEach(() => {
      authAPI = require('../api/auth').default
    })

    it('registers a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        company_name: 'Test Company',
        role: 'manufacturer'
      }

      const mockResponse = mockApiResponse.success({
        user: { id: 1, ...userData },
        token: 'mock-token'
      })
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await authAPI.registerUser(userData)

      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
    })

    it('logs in a user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockResponse = mockApiResponse.success({
        user: { id: 1, email: credentials.email, role: 'manufacturer' },
        token: 'mock-token'
      })
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await authAPI.loginUser(credentials.email, credentials.password)

      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/login', credentials)
      expect(result).toEqual(mockResponse.data)
    })

    it('gets current user info', async () => {
      const mockResponse = mockApiResponse.success({
        id: 1,
        email: 'test@example.com',
        role: 'manufacturer'
      })
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await authAPI.getCurrentUser()

      expect(mockAxios.get).toHaveBeenCalledWith('/api/auth/me')
      expect(result).toEqual(mockResponse.data)
    })

    it('handles API errors', async () => {
      const errorMessage = 'Invalid credentials'
      mockAxios.post.mockRejectedValue({
        response: { data: { detail: errorMessage } }
      })

      await expect(authAPI.loginUser('wrong@email.com', 'wrongpass'))
        .rejects.toThrow()
    })
  })

  describe('Product API', () => {
    let productAPI

    beforeEach(() => {
      // Mock auth token
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token')

      // Import after mocking
      productAPI = require('../api/products')
    })

    it('gets user products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', category: 'Electronics' },
        { id: 2, name: 'Product 2', category: 'Clothing' }
      ]
      const mockResponse = mockApiResponse.success(mockProducts)
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await productAPI.getUserProducts()

      expect(mockAxios.get).toHaveBeenCalledWith('/api/products/my-products/all')
      expect(result).toEqual(mockProducts)
    })

    it('creates a new product', async () => {
      const productData = {
        name: 'New Product',
        category: 'Electronics',
        sku: 'NEW-001'
      }

      const mockResponse = mockApiResponse.success({
        id: 1,
        ...productData,
        created_at: '2024-01-01T00:00:00Z'
      })
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await productAPI.createProduct(productData)

      expect(mockAxios.post).toHaveBeenCalledWith('/api/products/', productData)
      expect(result).toEqual(mockResponse.data)
    })

    it('updates a product', async () => {
      const productId = 1
      const updateData = { name: 'Updated Product' }

      const mockResponse = mockApiResponse.success({
        id: productId,
        name: 'Updated Product',
        category: 'Electronics'
      })
      mockAxios.put.mockResolvedValue(mockResponse)

      const result = await productAPI.updateProduct(productId, updateData)

      expect(mockAxios.put).toHaveBeenCalledWith(`/api/products/${productId}`, updateData)
      expect(result).toEqual(mockResponse.data)
    })

    it('deletes a product', async () => {
      const productId = 1
      const mockResponse = { status: 204 }
      mockAxios.delete.mockResolvedValue(mockResponse)

      await productAPI.deleteProduct(productId)

      expect(mockAxios.delete).toHaveBeenCalledWith(`/api/products/${productId}`)
    })
  })

  describe('Batch API', () => {
    let batchAPI

    beforeEach(() => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token')
      batchAPI = require('../api/batches')
    })

    it('gets user batches', async () => {
      const mockBatches = [
        { id: 1, product_id: 1, quantity: 100, status: 'active' },
        { id: 2, product_id: 2, quantity: 200, status: 'completed' }
      ]
      const mockResponse = mockApiResponse.success(mockBatches)
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await batchAPI.getUserBatches()

      expect(mockAxios.get).toHaveBeenCalledWith('/api/batches/my')
      expect(result).toEqual(mockBatches)
    })

    it('creates a new batch', async () => {
      const batchData = {
        product_id: 1,
        quantity: 100,
        material_composition: { plastic: 50, metal: 50 }
      }

      const mockResponse = mockApiResponse.success({
        id: 1,
        ...batchData,
        status: 'active',
        created_at: '2024-01-01T00:00:00Z'
      })
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await batchAPI.createBatch(batchData)

      expect(mockAxios.post).toHaveBeenCalledWith('/api/batches/', batchData)
      expect(result).toEqual(mockResponse.data)
    })

    it('gets batch QR code', async () => {
      const batchId = 1
      const mockResponse = mockApiResponse.success({
        qr_code: 'data:image/png;base64,...',
        batch_info: { id: batchId, product_name: 'Test Product' }
      })
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await batchAPI.getBatchQR(batchId)

      expect(mockAxios.get).toHaveBeenCalledWith(`/api/batches/${batchId}/qr`)
      expect(result).toEqual(mockResponse.data)
    })
  })
})