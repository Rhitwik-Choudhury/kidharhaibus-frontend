import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

const DriverSignUp = () => {
  return (
    <AuthLayout
      role="school"
      title="Add Driver"
      subtitle="Create a driver under your school"
    >
      <SignUpForm role="driver" isDashboard={true} />  {/* ✅ ADD THIS */}
    </AuthLayout>
  );
};

export default DriverSignUp;