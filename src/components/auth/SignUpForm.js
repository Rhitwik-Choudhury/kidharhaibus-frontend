// src/components/auth/SignUpForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Lock, User, Building, Code, Mail } from 'lucide-react';

// Demo student code used during MVP (optional field)
const DEMO_STUDENT_CODE = 'CHILD-DEMO-001';

const SignUpForm = ({ role }) => {
  const [formData, setFormData] = useState({
    // 👇 we’ll use fullName for BOTH parent and driver to match backend
    fullName: '',
    // keep name if you still use it elsewhere, but parent/driver should use fullName
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentCode: '',
    schoolName: '',
    adminName: '',
    driverCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const { signup, sendOTP, verifyOTP } = useAuth();
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(formData.email);
      setOtpSent(true);
      toast({
        title: 'OTP Sent!',
        description: 'Please check your email for the verification code.',
      });
    } catch (error) {
      toast({
        title: 'Failed to Send OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!otpSent) {
      toast({
        title: 'Verify Email',
        description: 'Please verify your email first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const isOtpValid = await verifyOTP(formData.email, otp);
      if (!isOtpValid) throw new Error('Invalid OTP');

      // base payload
      let userData = {
        email: formData.email,
        password: formData.password,
      };

      // role-specific fields
      switch (role) {
        case 'parent': {
          // ✅ Backend expects fullName, not name
          userData.fullName = formData.fullName;

          // optional demo fallback for MVP
          const finalCode =
            (formData.studentCode && formData.studentCode.trim()) || DEMO_STUDENT_CODE;
          userData.studentCode = finalCode;
          userData.children = [];

          // reflect auto-fill in the input if it was blank
          if (!formData.studentCode?.trim()) {
            setFormData((prev) => ({ ...prev, studentCode: finalCode }));
          }
          break;
        }
        case 'school': {
          userData.schoolName = formData.schoolName;
          userData.adminName = formData.adminName;
          break;
        }
        case 'driver': {
          // ✅ driver already uses fullName in your backend
          userData.fullName = formData.fullName;
          userData.driverCode = formData.driverCode;
          break;
        }
        default:
          break;
      }

      await signup(userData, role);

      toast({
        title: 'Account Created!',
        description:
          'Welcome to KidharHaiBus. Your account has been created successfully.',
      });

      navigate(config.dashboard);
    } catch (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Parent: Full Name (now uses fullName to match backend) */}
      {role === 'parent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="fullName"                 
              value={formData.fullName}       
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
            />
          </div>
        </div>
      )}

      {/* School fields */}
      {role === 'school' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="Enter school name"
                required
                className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleInputChange}
                placeholder="Enter admin name"
                required
                className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
              />
            </div>
          </div>
        </>
      )}

      {/* Driver: Full Name (already correct) */}
      {role === 'driver' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
            />
          </div>
        </div>
      )}

      {/* Email + OTP */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={otpSent}
              className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors disabled:bg-gray-100"
            />
          </div>
          {!otpSent && (
            <Button
              type="button"
              onClick={handleSendOTP}
              disabled={isLoading}
              className={`${config.buttonClass} px-4 py-3 text-sm font-medium rounded-lg`}
            >
              Send OTP
            </Button>
          )}
        </div>
      </div>

      {/* OTP */}
      {otpSent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code *
          </label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            required
            className="h-12 border-2 border-gray-200 focus:border-current transition-colors text-center text-lg tracking-widest"
          />
          <p className="text-xs text-gray-500 mt-1">Demo OTP: 123456</p>
        </div>
      )}

      {/* Passwords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a strong password"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Parent: Student Code (optional for demo) */}
      {role === 'parent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Code <span className="text-gray-400">(optional for demo)</span>
          </label>
          <div className="relative">
            <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="studentCode"
              value={formData.studentCode}
              onChange={handleInputChange}
              placeholder="Enter student code to link child"
              className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Demo code: <span className="font-medium">{DEMO_STUDENT_CODE}</span>
          </p>
        </div>
      )}

      {/* Driver: Driver Code */}
      {role === 'driver' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driver Code *
          </label>
          <div className="relative">
            <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="driverCode"
              value={formData.driverCode}
              onChange={handleInputChange}
              placeholder="Enter driver code issued by school"
              required
              className="pl-12 h-12 border-2 border-gray-200 focus:border-current transition-colors"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Use code: <span className="font-semibold text-orange-600">DRIVER2025</span>
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !otpSent}
        className={`w-full h-12 ${config.buttonClass} text-white font-semibold text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          to={`/auth/${role}/signin`}
          className={`${config.linkClass} font-medium transition-colors`}
        >
          Sign in here
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
