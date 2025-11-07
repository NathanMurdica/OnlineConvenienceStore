import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// --- MOCK DEPENDENCIES ---
// mock router inside the factory (no external pushMock variable!)
vi.mock('../src/router/index.js', () => {
  return {
    default: {
      push: vi.fn()
    }
  }
})

// mock database checkout function
vi.mock('../src/utils/database.js', () => ({
  checkoutOrder: vi.fn().mockResolvedValue({ message: 'Purchase successful!' })
}))

// mock Customer model
vi.mock('../src/models/customer.js', () => ({
  default: { fromJSON: (data) => data }
}))

// mock Order model
vi.mock('../src/models/order.js', () => ({
  default: { fromCart: (customer) => ({ customer, total: 20 }) }
}))

import Checkout from '../src/views/Checkout.vue'
import router from '../src/router/index.js'
import { checkoutOrder } from '../src/utils/database.js'

describe('Checkout.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders empty cart message when no customer exists', async () => {
    const wrapper = mount(Checkout)
    await flushPromises()
    expect(wrapper.text()).toContain('No customer data found')
    expect(wrapper.text()).toContain('Return to Catalogue')
  })

  it('renders customer info and items when customer exists', async () => {
    const mockCustomer = {
      name: 'John Doe',
      email: 'john@example.com',
      cart: {
        items: [
          { item: { id: 1, name: 'Apple', price: 2.5, formattedPrice: '$2.50' }, quantity: 2 }
        ],
        increaseQuantity: vi.fn(),
        decreaseQuantity: vi.fn(),
        removeItem: vi.fn()
      }
    }
    localStorage.setItem('customer', JSON.stringify(mockCustomer))

    const wrapper = mount(Checkout)
    await flushPromises()
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('$2.50')
  })

  it('handles confirmPurchase and clears cart', async () => {
    vi.useFakeTimers() // handle setTimeout in component

    const mockCustomer = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      cart: {
        items: [
          { item: { id: 1, name: 'Banana', price: 1.5, formattedPrice: '$1.50' }, quantity: 3 }
        ],
        increaseQuantity: vi.fn(),
        decreaseQuantity: vi.fn(),
        removeItem: vi.fn()
      }
    }
    localStorage.setItem('customer', JSON.stringify(mockCustomer))

    const wrapper = mount(Checkout)
    await flushPromises()

    const confirmBtn = wrapper.find('button.btn-success')
    await confirmBtn.trigger('click')
    await flushPromises()

    expect(checkoutOrder).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Purchase successful!')

    // advance timers to trigger router.push
    vi.advanceTimersByTime(1500)
    await flushPromises()

    expect(router.push).toHaveBeenCalledWith('/')

    vi.useRealTimers() // cleanup
  })
})
