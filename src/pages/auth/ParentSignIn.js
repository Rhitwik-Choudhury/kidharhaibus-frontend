import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';

const ParentSignIn = () => {
  return (
    <AuthLayout
      role="parent"
      title="Parent Sign In"
      subtitle="Access your child's journey tracking dashboard"
    >
      <SignInForm role="parent" />
    </AuthLayout>
  );
};

export default ParentSignIn;