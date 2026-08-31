import React from 'react';
import { Card, CardContent } from '../ui/card';

const SystemPreview = () => {
  const goToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const mobilePreviews = [
    {
      title: 'Parent App',
      description: 'Live bus location, trip status and pickup-location controls.',
      image: '/system-preview/parent-dashboard.png',
      alt: 'Trackefy parent app showing live trip status, bus route and pickup location controls'
    },
    {
      title: 'Driver App',
      description: 'Assigned bus details and simple controls for starting each trip.',
      image: '/system-preview/driver-dashboard.png',
      alt: 'Trackefy driver app showing assigned bus, route and start trip control'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See Trackefy in Action
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Real views from the tools parents, drivers and schools use every day.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {mobilePreviews.map((preview) => (
            <Card key={preview.title} className="border border-gray-200 bg-gray-50 shadow-xl overflow-hidden">
              <CardContent className="p-5 sm:p-7 text-center">
                <div className="mx-auto max-w-[280px] overflow-hidden rounded-[2rem] border-[7px] border-gray-900 bg-gray-900 shadow-2xl">
                  <img src={preview.image} alt={preview.alt} className="block w-full h-auto bg-white" loading="lazy" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-7 mb-2">
                    {preview.title}
                  </h3>
                <p className="text-gray-600">{preview.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border border-blue-100 bg-gray-50 shadow-xl overflow-hidden">
          <CardContent className="p-5 sm:p-7">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-inner">
              <img src="/system-preview/school-dashboard.png" alt="Trackefy school dashboard showing school code and student, driver, bus and trip overview" className="block w-full h-auto" loading="lazy" />
            </div>
            <div className="text-center mt-7">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School Dashboard</h3>
              <p className="text-gray-600">A clear overview of students, drivers, buses and active trips.</p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive preview button */}
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={goToContact}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default SystemPreview;
