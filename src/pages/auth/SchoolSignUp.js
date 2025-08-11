import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';

const SchoolSignUp = () => {
  return (
    <AuthLayout
      role="school"
      title="School Admin Sign Up"
      subtitle="Register your school to manage transportation efficiently"
    >
      <SignUpForm role="school" />
    </AuthLayout>
  );
};

export default SchoolSignUp;