import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../src/views/Login.vue'
import { validateLogin } from '../src/utils/validation.js'
import router from '../src/router'
import { loginUser } from '../src/utils/database.js'

// Mock the router
vi.mock('../src/router', () => ({
  default: {
    push: vi.fn()
  }
}))

// Mock the database calls
vi.mock('../src/utils/database.js', () => ({
  loginUser: vi.fn()
}))

describe('Login.vue Component', () => {
  let wrapper

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    // Create a fresh wrapper
    wrapper = mount(Login)
    
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders login form', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('displays validation errors for empty form submission', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    
    // Check for error messages
    const errorMessages = wrapper.findAll('.invalid-feedback')
    expect(errorMessages.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('validates email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    
    // Test invalid email
    await emailInput.setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Please enter a valid email address')
    
    // Test valid email
    await emailInput.setValue('valid@email.com')
    expect(validateLogin({ email: 'valid@email.com', password: 'password123' }).errors.email).toBeUndefined()
  })

  it('validates password length', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    
    // Test short password
    await passwordInput.setValue('12345')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at least 6 characters long')
    
    // Test valid password
    await passwordInput.setValue('password123')
    expect(validateLogin({ email: 'test@test.com', password: 'password123' }).errors.password).toBeUndefined()
  })

  it('calls loginUser with correct data on valid form submission', async () => {
    // Setup mock return value
    loginUser.mockResolvedValue({ id: 1, email: 'test@test.com' })

    // Fill in form with valid data
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    // Submit form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Verify loginUser was called with correct data
    expect(loginUser).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@test.com',
      password: 'password123'
    }))
  })

  it('redirects to home page on successful login', async () => {
    // Setup successful login response
    loginUser.mockResolvedValue({ id: 1, email: 'test@test.com' })

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Verify redirect
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('shows error message on failed login', async () => {
    // Setup failed login
    loginUser.mockResolvedValue(null)

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Verify error handling
    expect(wrapper.text()).toContain('Login failed')
  })

  it('handles network errors during login', async () => {
    // Setup network error
    loginUser.mockRejectedValue(new Error('Network error'))

    // Fill and submit form
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Verify error handling
    expect(wrapper.text()).toContain('Login failed')
  })
})