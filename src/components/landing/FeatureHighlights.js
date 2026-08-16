import React from 'react';
import { Card, CardContent } from '../ui/card';
import { 
  MapPin, 
  Shield, 
  Bell, 
  Route, 
  Users, 
  Radio 
} from 'lucide-react';

const FeatureHighlights = () => {
  const features = [
    {
      icon: Route,
      title: 'Real-Time Bus Tracking',
      description: 'Follow your child\'s school bus live throughout the journey with continuously updated GPS location.',
      color: 'bg-green-100 text-green-600',
      delay: 'delay-0'
    },
    {
      icon: Shield,
      title: 'Arrival Alerts',
      description: 'Receive notifications when the bus is approaching your selected pickup location and when it arrives.',
      color: 'bg-blue-100 text-blue-600',
      delay: 'delay-100'
    },
    {
      icon: Bell,
      title: 'Emergency Notifications',
      description: 'Instant emergency alerts with SOS features, breakdown notifications, and priority communication channels.',
      color: 'bg-red-100 text-red-600',
      delay: 'delay-200'
    },
    {
      icon: Route,
      title: 'Trip Monitoring',
      description: 'Monitor the school bus journey from trip start to trip end with live location and trip status updates.',
      color: 'bg-purple-100 text-purple-600',
      delay: 'delay-300'
    },
    {
      icon: MapPin,
      title: 'Custom Pickup Location',
      description: 'Parents can set their pickup location so Trackefy can provide more relevant arrival updates and notifications.',
      color: 'bg-orange-100 text-orange-600',
      delay: 'delay-400'
    },
    {
      icon: Radio,
      title: 'Broadcast Alerts',
      description: 'School-wide communication system for weather updates, route changes, and important announcements.',
      color: 'bg-teal-100 text-teal-600',
      delay: 'delay-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart tracking and timely alerts designed to give parents peace of mind 
            and help schools manage transportation more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card 
                key={index}
                className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in ${feature.delay} overflow-hidden`}
              >
                <CardContent className="p-8">
                  <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-orange-600">&lt;3s</div>
              <div className="text-gray-600 font-medium">Alert Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600 font-medium">Safe Trips</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;