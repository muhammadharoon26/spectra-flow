import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-background/90 backdrop-blur-sm">
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="font-bold text-white">S</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">SpectraFlow</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-white">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut}>
                Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
