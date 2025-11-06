// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Signin from "./pages/Signin"
import { Signup } from "./pages/Signin"
import Dashboard from "./pages/Dashboard"
import { ToastProvider } from "./hooks/useToast"

function isAuthed() {
  return !!localStorage.getItem("et_token")
}

function GuestRoute({ children }) {
  return isAuthed() ? <Navigate to="/dashboard" replace /> : children
}

function ProtectedRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/auth/signin" replace />
}

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/auth/signin"
            element={
              <GuestRoute>
                <Signin />
              </GuestRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}
