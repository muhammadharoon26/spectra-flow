import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Home';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading spectra...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;