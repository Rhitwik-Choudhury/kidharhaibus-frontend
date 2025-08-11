import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Smartphone } from 'lucide-react';

const SystemPreview = () => {
  const mockups = [
    {
      title: 'Parent Dashboard',
      color: 'red',
      features: ['Live Bus Location', 'Child Status', 'Instant Alerts', 'Trip History'],
      image: '/api/placeholder/300/600'
    },
    {
      title: 'Driver Dashboard',
      color: 'orange', 
      features: ['Start/End Trip', 'Student List', 'Route Navigation', 'Quick Alerts'],
      image: '/api/placeholder/300/600'
    },
    {
      title: 'School Admin Panel',
      color: 'blue',
      features: ['Fleet Overview', 'Route Management', 'Driver Assignment', 'Analytics'],
      image: '/api/placeholder/300/600'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'bg-gradient-to-br from-red-500 to-red-600',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600'
    };
    return colorMap[color];
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            System Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience intuitive dashboards designed specifically for each user role, 
            ensuring everyone gets exactly what they need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockups.map((mockup, index) => (
            <div key={index} className="text-center group">
              <Card className="bg-gray-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-4 overflow-hidden">
                <CardContent className="p-8">
                  {/* Phone mockup */}
                  <div className="relative mx-auto w-48 h-96 mb-6">
                    <div className="absolute inset-0 bg-gray-800 rounded-3xl shadow-2xl">
                      {/* Phone frame */}
                      <div className="absolute inset-2 bg-gray-900 rounded-2xl">
                        {/* Screen */}
                        <div className={`absolute inset-1 ${getColorClasses(mockup.color)} rounded-2xl flex flex-col items-center justify-center text-white p-4`}>
                          <Smartphone className="w-12 h-12 mb-4 opacity-80" />
                          <h3 className="text-lg font-bold mb-2">{mockup.title}</h3>
                          <div className="space-y-2 w-full">
                            {mockup.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                                <span className="text-xs font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Home indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white rounded-full opacity-60"></div>
                      </div>
                      
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gray-900 rounded-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {mockup.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Optimized interface for seamless user experience
                  </p>
                </CardContent>
              </Card>
              
              {/* Floating elements */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 ${getColorClasses(mockup.color)} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Interactive preview button */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
            Try Interactive Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default SystemPreview;