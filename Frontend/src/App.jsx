import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Analyze from "./pages/Analyze"
import Results from "./pages/Results"
import Documentation from "./pages/Documentation"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import PrivateRoute from "./components/PrivateRoute"
import GuidedTour from "./components/GuidedTour"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/analyze"
                element={
                  <PrivateRoute>
                    <Analyze />
                  </PrivateRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                }
              />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <GuidedTour />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

