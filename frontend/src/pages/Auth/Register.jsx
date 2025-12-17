import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(formData);
      navigate('/');
    } catch (e) {
      if (e.response?.status === 422) {
        setError(Object.values(e.response.data.errors).flat().join(', '));
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-background order-2 lg:order-1">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-muted-foreground">Get started with SpectraFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <Input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-black relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop')] bg-cover opacity-50"></div>
        <div className="relative z-10 text-right">
           <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">Join the Future</h1>
            <p className="text-xl text-gray-300 ml-auto max-w-lg">
              Start scraping data asynchronously with our powerful distributed engine.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
