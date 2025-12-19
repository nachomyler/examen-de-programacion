import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Flights from './pages/Flights'
import FlightDetails from './pages/FlightDetails'
import EditFlight from './pages/EditFlight'
import PlaneManagement from './pages/PlaneManagement'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flights"
            element={
              <ProtectedRoute>
                <Flights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flights/:id"
            element={
              <ProtectedRoute>
                <FlightDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flights/:id/edit"
            element={
              <ProtectedRoute>
                <EditFlight />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planes"
            element={
              <ProtectedRoute>
                <PlaneManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/flights" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App