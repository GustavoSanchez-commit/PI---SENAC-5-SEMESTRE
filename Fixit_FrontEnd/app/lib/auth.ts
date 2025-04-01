// Types for our authentication system
export interface User {
  id: string
  name: string
  email: string
  telephone?: string
  department?: string
  password: string // In a real app, we would never store plain text passwords
  createdAt: string
  role?: "admin" | "user" | "technician"
}

// Key for localStorage
const USERS_STORAGE_KEY = "fixit_users"
const CURRENT_USER_KEY = "fixit_current_user"

// Get all users from localStorage
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
  if (!usersJson) return []

  try {
    return JSON.parse(usersJson)
  } catch (error) {
    console.error("Failed to parse users from localStorage", error)
    return []
  }
}

// Save users to localStorage
export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

// Register a new user
export function registerUser(userData: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()

  // Check if email already exists
  if (users.some((user) => user.email === userData.email)) {
    throw new Error("Email already registered")
  }

  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword as User
}

// Login a user
export function loginUser(email: string, password: string): Omit<User, "password"> {
  const users = getUsers()
  const user = users.find((user) => user.email === email && user.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Save current user to localStorage (without password)
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))

  return userWithoutPassword
}

// Get current logged in user
export function getCurrentUser(): Omit<User, "password"> | null {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem(CURRENT_USER_KEY)
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Failed to parse current user from localStorage", error)
    return null
  }
}

// Check if current user is admin
export function isAdmin(): boolean {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  return currentUser.email === "admin@fixit.com" || currentUser.role === "admin"
}

// Initialize admin user and technicians if they don't exist
export function initializeAdminUser(): void {
  if (typeof window === "undefined") return

  const users = getUsers()
  const adminExists = users.some((user) => user.email === "admin@fixit.com")

  if (!adminExists) {
    const adminUser: User = {
      id: "admin-" + generateId(),
      name: "Administrador",
      email: "admin@fixit.com",
      password: "admin",
      department: "ti",
      createdAt: new Date().toISOString(),
      role: "admin",
    }

    users.push(adminUser)
    console.log("Admin user initialized")
  }

  // Initialize technicians if they don't exist
  const technicians = [
    {
      name: "Guilherme",
      email: "guilherme@fixit.com",
      password: "guilherme",
    },
    {
      name: "Caio",
      email: "caio@fixit.com",
      password: "caio",
    },
    {
      name: "Gustavo",
      email: "gustavo@fixit.com",
      password: "gustavo",
    },
    {
      name: "Mariana",
      email: "mariana@fixit.com",
      password: "mariana",
    },
  ]

  let technicianAdded = false

  technicians.forEach((tech) => {
    const techExists = users.some((user) => user.email === tech.email)

    if (!techExists) {
      const techUser: User = {
        id: "tech-" + generateId(),
        name: tech.name,
        email: tech.email,
        password: tech.password,
        department: "suporte",
        createdAt: new Date().toISOString(),
        role: "technician",
      }

      users.push(techUser)
      technicianAdded = true
    }
  })

  if (technicianAdded) {
    console.log("Technicians initialized")
  }

  saveUsers(users)
}

// Logout current user
export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Helper function to generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

