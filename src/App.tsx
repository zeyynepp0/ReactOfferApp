// Uygulama yönlendirmeleri
import  LoginPage  from "./pages/LoginPage"
import  OffersPage  from "./pages/OffersPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/offers" 
          element={
            <ProtectedRoute>
              <OffersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          
          
        />
        
      </Routes>
    </Router>
  )
}

export default App
