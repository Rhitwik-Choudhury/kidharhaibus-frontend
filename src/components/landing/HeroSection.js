import React from 'react';
import { Button } from '../ui/button';
import { MapPin, Shield, Clock } from 'lucide-react';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1503676685182-2531a01b5b5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzY2hvb2wlMjBidXN8ZW58MHx8fHwxNzUzMjgyMzc5fDA&ixlib=rb-4.1.0&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Animated badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-pulse">
            <Shield className="w-4 h-4 mr-2" />
            Coming soon across all India
          </div>

          {/* Main heading with animation */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trackify
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 animate-slide-up">
            Track. Alert. Arrive Safe.
          </p>

          {/* Description */}
          <p className="relative z-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Stay connected to your child's journey in real-time. Our smart tracking system ensures 
            peace of mind for parents, efficiency for schools, and safety for every child on the road.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">Live Location</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-gray-700 font-medium">Real-time Alerts</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Emergency SOS</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Tracking Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200/50">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 font-medium">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600">50K+</div>
              <div className="text-gray-600 font-medium">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600">1M+</div>
              <div className="text-gray-600 font-medium">Safe Rides</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-ping"></div>
    </section>
  );
};

export default HeroSection;