import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const SignInForm = ({ role }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getRoleConfig = (role) => {
    const configs = {
      parent: {
        color: 'red',
        buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        linkClass: 'text-red-600 hover:text-red-700',
        dashboard: '/parent/dashboard'
      },
      school: {
        color: 'blue',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        linkClass: 'text-blue-600 hover:text-blue-700',
        dashboard: '/school/dashboard'
      },
      driver: {
        color: 'orange',
        buttonClass: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
        linkClass: 'text-orange-600 hover:text-orange-700',
        dashboard: '/driver/dashboard'
      }
    };
    return configs[role] || configs.parent;
  };

  const config = getRoleConfig(role);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password, role);

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });

      navigate(config.dashboard);
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-current focus:ring-current border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className={`${config.linkClass} font-medium transition-colors`}>
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className={`w-full h-12 ${config.buttonClass} text-white font-semibold text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-offset-2`}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to={`/auth/${role}/signup`}
          className={`${config.linkClass} font-medium transition-colors`}
        >
          Sign up here
        </Link>
      </div>

      {/* Demo credentials hint */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {role === 'parent' && (
            <>
              <div>Email: parent@example.com</div>
              <div>Password: parent123</div>
            </>
          )}
          {role === 'school' && (
            <>
              <div>Email: school@example.com</div>
              <div>Password: school123</div>
            </>
          )}
          {role === 'driver' && (
            <>
              <div>Email: driver@example.com</div>
              <div>Password: driver123</div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
