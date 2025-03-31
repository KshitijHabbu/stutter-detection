"use client"
import Header from "./Header"
import { useTheme } from "../contexts/ThemeContext"
import { Sun, Moon } from "lucide-react"
import { Button } from "./ui/button"
import GuidedTour from "./GuidedTour"

function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`${theme} bg-background text-foreground min-h-screen flex flex-col`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>
      <footer className="border-t py-4 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 StutterSense. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </footer>
      <GuidedTour />
    </div>
  )
}

export default Layout

