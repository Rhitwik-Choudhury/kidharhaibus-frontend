import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';

const DriverSignIn = () => {
  return (
    <AuthLayout
      role="driver"
      title="Driver Sign In"
      subtitle="Access your trip management dashboard"
    >
      <SignInForm role="driver" />
    </AuthLayout>
  );
};

export default DriverSignIn;