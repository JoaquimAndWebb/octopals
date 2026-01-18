import { create } from 'zustand'

type ModalType =
  | 'create-club'
  | 'edit-club'
  | 'create-session'
  | 'edit-session'
  | 'rsvp'
  | 'checkout-equipment'
  | 'return-equipment'
  | 'log-training'
  | 'new-message'
  | 'confirm-delete'
  | null

interface UIState {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // Mobile
  mobileMenuOpen: boolean

  // Modals
  activeModal: ModalType
  modalData: Record<string, unknown> | null

  // Toast/notifications
  toastQueue: Toast[]

  // Loading states
  globalLoading: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setGlobalLoading: (loading: boolean) => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

let toastId = 0

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  toastQueue: [],
  globalLoading: false,

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Mobile menu actions
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Modal actions
  openModal: (modal, data) => set({ activeModal: modal, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toast actions
  addToast: (toast) =>
    set((state) => ({
      toastQueue: [...state.toastQueue, { ...toast, id: `toast-${++toastId}` }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((t) => t.id !== id),
    })),

  // Loading actions
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}))
