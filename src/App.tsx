//import { useState } from 'react'
import './App.css'
import  LoginPage  from "./pages/LoginPage"
import  OffersPage  from "./pages/OffersPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  //const [count, setCount] = useState(0)

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
          path="/" 
          
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
