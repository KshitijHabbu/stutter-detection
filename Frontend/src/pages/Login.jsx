"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, LogIn, User, UserCog } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState("patient")
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page to redirect to after login
  const from = location.state?.from?.pathname || "/"

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, userType })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to log in")
      }
      // Optionally, use AuthContext's login function if you need to save tokens/session info.
      await login(email, password, userType)
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen p-4 bg-background"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center gradient-text">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="patient" onValueChange={setUserType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="slp" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                SLP
              </TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Log in as a patient to track your speech progress and view your results.
              </p>
            </TabsContent>
            <TabsContent value="slp">
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Log in as a Speech-Language Pathologist to access detailed analysis and patient records.
              </p>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : (<><LogIn className="mr-2 h-4 w-4" /> Sign In</>)}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
