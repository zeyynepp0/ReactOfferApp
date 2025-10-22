// Uygulama yönlendirmeleri
import LoginPage from "./pages/LoginPage";
import OffersPage from "./pages/OffersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right" // Bildirimlerin sağ üstte çıkması için
        autoClose={3000} // 3 saniye sonra otomatik kapanması için
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Renkli bildirimler için 
      />
      
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
      </Routes>
    </Router>
  );
}

export default App;
