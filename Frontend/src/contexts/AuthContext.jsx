"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the authentication context
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Signup function
  const signup = (email, password, name, userType) => {
    // In a real app, this would call an API
    // For now, we'll simulate by storing in localStorage
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      userType, // "patient" or "slp"
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    setCurrentUser(newUser)
    return Promise.resolve(newUser)
  }

  // Login function
  const login = (email, password, userType) => {
    // In a real app, this would validate against an API
    // For now, we'll simulate a successful login
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0], // Extract name from email
      userType, // "patient" or "slp"
    }

    localStorage.setItem("user", JSON.stringify(user))
    setCurrentUser(user)
    return Promise.resolve(user)
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
    return Promise.resolve()
  }

  const value = {
    currentUser,
    userType: currentUser?.userType,
    isPatient: currentUser?.userType === "patient",
    isSLP: currentUser?.userType === "slp",
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

