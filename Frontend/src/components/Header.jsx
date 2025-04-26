"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Mic, BarChart2, FileText, LogOut, User } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout, userType } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-10 flex items-center justify-center">
              <img src="/Images/viit-logo.png" alt="VIIT Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="h-8 flex items-center justify-center">
              <img src="/Images/dassault-logo.png" alt="Dassault Systèmes Logo" className="h-10 w-auto object-contain" />
            </div>
            <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StutterSense</span>
          </Link>
          </div>
        </div>
        <nav className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <Link
                to="/analyze"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/analyze" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Mic className="h-4 w-4" />
                <span>Analyze</span>
              </Link>
              <Link
                to="/documentation"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/documentation" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Docs</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name || currentUser.email}</span>
                      <span className="text-xs text-muted-foreground capitalize">{userType}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/documentation"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/documentation" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Docs</span>
              </Link>
              <Button asChild variant="outline">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

