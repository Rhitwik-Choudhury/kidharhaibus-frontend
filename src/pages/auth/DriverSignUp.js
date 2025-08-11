import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

const DriverSignUp = () => {
  return (
    <AuthLayout
      role="driver"
      title="Driver Sign Up"
      subtitle="Join as a driver to manage your trips efficiently"
    >
      <SignUpForm role="driver" />
    </AuthLayout>
  );
};

export default DriverSignUp;