import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import UseCaseSection from '../components/landing/UseCaseSection';
import SystemPreview from '../components/landing/SystemPreview';
import FeatureHighlights from '../components/landing/FeatureHighlights';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UseCaseSection />
      <SystemPreview />
      <FeatureHighlights />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;