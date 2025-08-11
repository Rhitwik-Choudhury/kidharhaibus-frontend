import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Building2, Truck } from 'lucide-react';

const UseCaseSection = () => {
  const useCases = [
    {
      icon: Users,
      title: 'Parents',
      subtitle: 'Track & Alert',
      description: 'Get real-time updates on your child\'s journey, receive pickup and drop-off notifications, and access emergency features for complete peace of mind.',
      color: 'red',
      features: ['Live location tracking', 'Instant alerts', 'Emergency SOS', 'Trip history']
    },
    {
      icon: Building2,
      title: 'Schools',
      subtitle: 'Manage Fleet',
      description: 'Efficiently manage your entire bus fleet, monitor routes, track attendance, and ensure the safety of all students with comprehensive admin tools.',
      color: 'blue',
      features: ['Fleet management', 'Route optimization', 'Driver monitoring', 'Attendance tracking']
    },
    {
      icon: Truck,
      title: 'Drivers',
      subtitle: 'Trip Status',
      description: 'Streamline your daily operations with easy trip management, quick communication tools, and real-time navigation assistance.',
      color: 'orange',
      features: ['Trip management', 'Navigation assist', 'Quick alerts', 'Performance tracking']
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'bg-red-100 text-red-600',
        title: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        title: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'bg-orange-100 text-orange-600',
        title: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    return colorMap[color];
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a parent wanting peace of mind, a school managing transportation, 
            or a driver ensuring safe journeys, KidharHaiBus has you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color);
            const Icon = useCase.icon;
            
            return (
              <Card 
                key={index}
                className={`${colors.bg} ${colors.border} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`${colors.icon} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className={`text-2xl font-bold ${colors.title}`}>
                    {useCase.title}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">
                    {useCase.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Key Features:</h4>
                    <ul className="space-y-1">
                      {useCase.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className={`w-2 h-2 ${colors.icon.split(' ')[0]} rounded-full mr-2`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className={`w-full ${colors.button} text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 mt-6`}>
                    Learn More
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;