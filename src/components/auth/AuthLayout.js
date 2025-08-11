import React from 'react';
import { Bus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const AuthLayout = ({ children, role, title, subtitle }) => {
  const navigate = useNavigate();

  const getRoleConfig = (role) => {
    const configs = {
      parent: {
        color: 'red',
        gradient: 'from-red-500 to-red-600',
        bgGradient: 'from-red-50 to-red-100',
        icon: '👩‍👦'
      },
      school: {
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100',
        icon: '🏫'
      },
      driver: {
        color: 'orange',
        gradient: 'from-orange-500 to-orange-600',
        bgGradient: 'from-orange-50 to-orange-100',
        icon: '👨‍✈️'
      }
    };
    return configs[role] || configs.parent;
  };

  const config = getRoleConfig(role);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Bus className="h-6 w-6 text-gray-700" />
          <span className="text-xl font-bold text-gray-900">KidharHaiBus</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Role Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{config.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Secured by KidharHaiBus • Your data is safe with us
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className={`absolute top-20 left-20 w-20 h-20 bg-gradient-to-r ${config.gradient} rounded-full opacity-10 animate-pulse`}></div>
      <div className={`absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r ${config.gradient} rounded-full opacity-10 animate-bounce`}></div>
    </div>
  );
};

export default AuthLayout;