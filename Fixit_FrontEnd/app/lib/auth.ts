export interface User {
  id: string
  name: string
  email: string
  telephone?: string
  department?: string
  password: string
  createdAt: string
  role?: "admin" | "user" | "technician"
}

const CURRENT_USER_KEY = "fixit_current_user"
const USERS_STORAGE_KEY = "fixit_users"

// Initialize default users
export function initializeDefaultUsers(): void {
  if (typeof window === "undefined") return

  let users: User[] = []

  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
    if (usersJson) {
      users = JSON.parse(usersJson)
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage", error)
    // If there's an error parsing, we'll start with an empty array
    users = []
  }

  // Check if default users already exist
  const adminExists = users.some((user) => user.email === "admin@fixit.com")
  const techExists = users.some((user) => user.email === "tech@fixit.com")
  const userExists = users.some((user) => user.email === "user@fixit.com")

  const defaultUsers: User[] = []

  // Add admin if it doesn't exist
  if (!adminExists) {
    defaultUsers.push({
      id: "admin-1",
      name: "Administrador",
      email: "admin@fixit.com",
      password: "admin123",
      createdAt: new Date().toISOString(),
      role: "admin",
      telephone: "(11) 99999-9999",
      department: "ti",
    })
  }

  // Add technician if it doesn't exist
  if (!techExists) {
    defaultUsers.push({
      id: "tech-1",
      name: "Técnico Suporte",
      email: "tech@fixit.com",
      password: "tech123",
      createdAt: new Date().toISOString(),
      role: "technician",
      telephone: "(11) 88888-8888",
      department: "suporte",
    })
  }

  // Add regular user if it doesn't exist
  if (!userExists) {
    defaultUsers.push({
      id: "user-1",
      name: "Usuário Comum",
      email: "user@fixit.com",
      password: "user123",
      createdAt: new Date().toISOString(),
      role: "user",
      telephone: "(11) 77777-7777",
      department: "marketing",
    })
  }

  // Add default users to the users array
  if (defaultUsers.length > 0) {
    users = [...users, ...defaultUsers]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    console.log(
      "Default users initialized:",
      defaultUsers.map((u) => u.email),
    )
  }
}

// Registrar novo usuário via backend
export async function registerUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  try {
    const response = await fetch("http://localhost:8080/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erro ao registrar usuário")
    }

    const createdUser: User = await response.json()
    const { password, ...userWithoutPassword } = createdUser
    return userWithoutPassword as User
  } catch (err) {
    console.error("Erro no registro:", err)
    throw err
  }
}

// New login function that uses the backend's login endpoint
export async function login(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:8080/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      console.log(email, password)
      throw new Error("Email ou senha inválidos")
    }

    const usuario = await response.json()

    // Salva no localStorage se quiser manter o usuário logado
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario))

    return usuario
  } catch (error) {
    console.error("Erro no login:", error)
    throw error
  }
}

// Maintain the original loginUser function for backward compatibility
export async function loginUser(email: string, password: string): Promise<Omit<User, "password">> {
  // Initialize default users if they don't exist yet
  initializeDefaultUsers()

  try {
    // First check if it's one of our default users
    const localUsers = getLocalUsers()
    const localUser = localUsers.find((u) => u.email === email && u.password === password)

    if (localUser) {
      const { password: _, ...userWithoutPassword } = localUser
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
      console.log("Logged in with local user:", email)
      return userWithoutPassword
    }

    // If not a default user, try the new login function
    try {
      return await login(email, password)
    } catch (loginError) {
      console.error("Backend login failed:", loginError)

      // If backend login fails, try the old way as fallback
      const response = await fetch("http://localhost:8080/usuarios")
      if (!response.ok) throw new Error("Erro ao buscar usuários")

      const users: User[] = await response.json()
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Email ou senha inválidos")
      }

      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))

      return userWithoutPassword
    }
  } catch (err) {
    console.error("Erro no login:", err)
    throw err
  }
}

// Usuário atual logado
export function getCurrentUser(): Omit<User, "password"> | null {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem(CURRENT_USER_KEY)
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Erro ao obter usuário logado:", error)
    return null
  }
}

// Logout
export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Verifica se o usuário é admin
export function isAdmin(): boolean {
  const currentUser = getCurrentUser()
  return currentUser?.email === "admin@fixit.com" || currentUser?.role === "admin"
}

// Get local default users (for testing)
function getLocalUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
  if (!usersJson) return []

  try {
    return JSON.parse(usersJson)
  } catch (error) {
    console.error("Error fetching local users:", error)
    return []
  }
}

// Get all users from backend
export async function getUsers(): Promise<User[]> {
  try {
    // First get local default users
    const localUsers = getLocalUsers()

    // Then get backend users
    const response = await fetch("http://localhost:8080/usuarios")
    if (!response.ok) {
      console.error("Failed to fetch users from backend, using only local users")
      return localUsers
    }

    const backendUsers = await response.json()

    // Combine both sets of users, giving priority to backend users
    // (in case of duplicate emails, the backend user will override the local one)
    const combinedUsers = [...localUsers]

    backendUsers.forEach((backendUser: User) => {
      const existingIndex = combinedUsers.findIndex((u) => u.email === backendUser.email)
      if (existingIndex >= 0) {
        combinedUsers[existingIndex] = backendUser
      } else {
        combinedUsers.push(backendUser)
      }
    })

    return combinedUsers
  } catch (error) {
    console.error("Error fetching users:", error)
    // Fallback to local users if backend fails
    return getLocalUsers()
  }
}

// Initialize admin user (keeping for backward compatibility)
export function initializeAdminUser(): void {
  initializeDefaultUsers()
}

