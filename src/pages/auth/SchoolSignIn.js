import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';

const SchoolSignIn = () => {
  return (
    <AuthLayout
      role="school"
      title="School Admin Sign In"
      subtitle="Access your school's fleet management dashboard"
    >
      <SignInForm role="school" />
    </AuthLayout>
  );
};

export default SchoolSignIn;