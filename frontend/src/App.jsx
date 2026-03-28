import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import DocumentPage from './pages/DocumentPage';
import NewsPage from './pages/NewsPage';
import EligibilityCalculator from './pages/EligibilityCalculator';
import RecommendationPage from './pages/RecommendationPage';
import ApplicationGuidePage from './pages/ApplicationGuidePage';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="p-20 text-center font-bold text-primary animate-pulse text-2xl">Loading Secure Session...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen bg-[#020617] flex flex-col font-sans transition-colors duration-500 selection:bg-primary/30 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/calculator" element={<EligibilityCalculator />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vault" 
                element={
                  <ProtectedRoute>
                    <DocumentPage />
                   </ProtectedRoute>
                 } 
               />
              <Route 
                path="/recommendations" 
                element={
                  <ProtectedRoute>
                    <RecommendationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schemes/:id/guide" 
                element={
                  <ProtectedRoute>
                    <ApplicationGuidePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
