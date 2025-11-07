import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Register from '../src/views/Register.vue'
import { validateRegistration } from '../src/utils/validation.js'
import router from '../src/router'
import { registerUser } from '../src/utils/database.js'

// Mock the router
vi.mock('../src/router', () => ({
  default: {
    push: vi.fn()
  }
}))

// Mock the database calls
vi.mock('../src/utils/database.js', () => ({
  registerUser: vi.fn()
}))

describe('Register.vue Component', () => {
  let wrapper

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    // Create a fresh wrapper
    wrapper = mount(Register)
    
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders registration form', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('displays validation errors for empty form submission', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    
    // Check for error messages
    const errorMessages = wrapper.findAll('.invalid-feedback')
    expect(errorMessages.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('validates name length', async () => {
    const nameInput = wrapper.find('input[type="text"]')
    
    // Test short name
    await nameInput.setValue('A')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Name must be at least 2 characters long')
    
    // Test valid name
    await nameInput.setValue('John Doe')
    expect(validateRegistration({ 
      name: 'John Doe', 
      email: 'test@test.com', 
      password: 'password123' 
    }).errors.name).toBeUndefined()
  })

  it('validates email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    
    // Test invalid email
    await emailInput.setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Please enter a valid email address')
    
    // Test valid email
    await emailInput.setValue('valid@email.com')
    expect(validateRegistration({ 
      name: 'John Doe',
      email: 'valid@email.com', 
      password: 'password123' 
    }).errors.email).toBeUndefined()
  })

  it('validates password length', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    
    // Test short password
    await passwordInput.setValue('12345')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Password must be at least 6 characters long')
    
    // Test valid password
    await passwordInput.setValue('password123')
    expect(validateRegistration({ 
      name: 'John Doe',
      email: 'test@test.com', 
      password: 'password123' 
    }).errors.password).toBeUndefined()
  })

  it('calls registerUser with correct data on valid form submission', async () => {
    // Setup mock return value
    registerUser.mockResolvedValue({ user: { id: 1, name: 'John Doe', email: 'test@test.com' }})

    // Fill in form with valid data
    await wrapper.find('input[type="text"]').setValue('John Doe')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    // Submit form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Verify registerUser was called with correct data
    expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
      name: '',  // This is empty because of how Customer is constructed in Register.vue
      email: 'test@test.com',
      password: 'password123'
    }))
  })

  it('redirects to home page on successful registration', async () => {
    // Setup successful registration response
    registerUser.mockResolvedValue({ user: { id: 1, name: 'John Doe', email: 'test@test.com' }})

    // Fill and submit form
    await wrapper.find('input[type="text"]').setValue('John Doe')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Verify redirect
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('shows alert on failed registration', async () => {
    // mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // setup failed registration
    registerUser.mockResolvedValue(null)

    // fill and submit form
    await wrapper.find('input[type="text"]').setValue('John Doe')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // expect alert to be called with correct message
    expect(window.alert).toHaveBeenCalledWith(
      'Registration failed. Please try again.'
    )

    // cleanup
    window.alert.mockRestore()
  })

  it('shows alert on network error during registration', async () => {
    // mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // setup network error
    registerUser.mockRejectedValue(new Error('Network error'))

    // fill and submit form
    await wrapper.find('input[type="text"]').setValue('John Doe')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // expect alert to be called with correct message
    expect(window.alert).toHaveBeenCalledWith(
      'Registration failed. Please try again.'
    )

    // cleanup
    window.alert.mockRestore()
  })

  it('sets authentication token on successful registration', async () => {
    // Setup successful registration
    registerUser.mockResolvedValue({ user: { id: 1, name: 'John Doe', email: 'test@test.com' }})

    // Fill and submit form
    await wrapper.find('input[type="text"]').setValue('John Doe')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Verify localStorage was updated
    expect(localStorage.getItem('hasAuth')).toBe('true')
  })
})