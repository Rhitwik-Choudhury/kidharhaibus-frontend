import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

const ParentSignUp = () => {
  return (
    <AuthLayout
      role="parent"
      title="Parent Sign Up"
      subtitle="Create your account to start tracking your child's journey"
    >
      <SignUpForm role="parent" />
    </AuthLayout>
  );
};

export default ParentSignUp;