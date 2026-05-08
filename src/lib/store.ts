import { create } from 'zustand'

export type View = 'home' | 'notes' | 'books' | 'dashboard'

export interface Note {
  id: string
  title: string
  description: string | null
  subject: string
  fileName: string
  fileSize: number
  fileUrl: string
  price: number
  type: 'sell' | 'donate'
  downloads: number
  userId: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
    college: string | null
  }
}

export interface Book {
  id: string
  title: string
  author: string
  edition: string | null
  condition: string
  price: number
  type: 'sell' | 'lend' | 'donate'
  description: string | null
  imageUrl: string | null
  status: string
  userId: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
    phone: string | null
    college: string | null
  }
}

export interface Order {
  id: string
  userId: string
  noteId: string
  amount: number
  commission: number
  sellerPayout: number
  razorpayPaymentId: string | null
  status: string
  createdAt: string
  note?: Note
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  phone: string | null
  college: string | null
  upiId?: string | null
  accountName?: string | null
  accountNumber?: string | null
  ifscCode?: string | null
}

interface AppState {
  currentView: View
  setCurrentView: (view: View) => void

  currentUser: CurrentUser | null
  setCurrentUser: (user: CurrentUser | null) => void

  notes: Note[]
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void

  books: Book[]
  setBooks: (books: Book[]) => void
  addBook: (book: Book) => void

  orders: Order[]
  setOrders: (orders: Order[]) => void

  searchQuery: string
  setSearchQuery: (query: string) => void

  selectedNote: Note | null
  setSelectedNote: (note: Note | null) => void

  selectedBook: Book | null
  setSelectedBook: (book: Book | null) => void

  showUploadDialog: boolean
  setShowUploadDialog: (show: boolean) => void

  showListBookDialog: boolean
  setShowListBookDialog: (show: boolean) => void

  showPaymentDialog: boolean
  setShowPaymentDialog: (show: boolean) => void

  paymentNote: Note | null
  setPaymentNote: (note: Note | null) => void

  showAuthDialog: boolean
  setShowAuthDialog: (show: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),

  books: [],
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [book, ...state.books] })),

  orders: [],
  setOrders: (orders) => set({ orders }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedNote: null,
  setSelectedNote: (note) => set({ selectedNote: note }),

  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),

  showUploadDialog: false,
  setShowUploadDialog: (show) => set({ showUploadDialog: show }),

  showListBookDialog: false,
  setShowListBookDialog: (show) => set({ showListBookDialog: show }),

  showPaymentDialog: false,
  setShowPaymentDialog: (show) => set({ showPaymentDialog: show }),

  paymentNote: null,
  setPaymentNote: (note) => set({ paymentNote: note }),

  showAuthDialog: false,
  setShowAuthDialog: (show) => set({ showAuthDialog: show }),
}))
