import { toast } from 'sonner'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type CartItem = {
  id: string | number
  title: string
  price: number
  image: string
  quantity: number
}

type CartStore = {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...state.items, item]

          toast.success(`Product ${item.id} Added to Cart`)

          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            ),
          }
        }),

      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id)

          toast.success(`Product ${id} removed`, {
            className: '',
          })

          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            ),
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            ),
          }
        }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage', // unique name for storage
      storage: createJSONStorage(() => localStorage), // default is localStorage
    }
  )
)

export default useCartStore
