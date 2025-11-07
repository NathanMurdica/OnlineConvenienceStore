import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../src/views/Login.vue'
import { validateLogin } from '../src/utils/validation.js'
import router from '../src/router/index.js'
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

  it('shows alert on failed login', async () => {
    // mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // setup failed login
    loginUser.mockResolvedValue(null)

    // fill and submit form
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // expect alert to be called with correct message
    expect(window.alert).toHaveBeenCalledWith(
      'Login failed. Please check your email and password.'
    )

    // cleanup
    window.alert.mockRestore()
  })

  it('shows alert on network error during login', async () => {
    // mock alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // setup network error
    loginUser.mockRejectedValue(new Error('Network error'))

    // fill and submit form
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // expect alert to be called with correct message
    expect(window.alert).toHaveBeenCalledWith(
      'Login failed. Please check your email and password.'
    )

    // Cleanup
    window.alert.mockRestore()
  })

})