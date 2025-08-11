import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Bus, School, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setIsSignInOpen(false);
    navigate(`/auth/${role}/signin`);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center">
        <div className="flex items-center justify-between px-8 py-4 w-[90%] max-w-4xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Bus className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-black">
              KidharHaiBus
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-black font-medium hover:underline"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-black font-medium hover:underline"
            >
              Contact
            </button>
            <Button
              onClick={() => setIsSignInOpen(true)}
              className="bg-white text-black px-4 py-2 shadow-sm hover:bg-gray-100"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsSignInOpen(true)}
              className="bg-white text-black px-4 py-2 shadow-sm hover:bg-gray-100"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Sign In Role Selection Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Choose Your Role
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition transform hover:scale-105 border-2 hover:border-red-500"
              onClick={() => handleRoleSelect('parent')}
            >
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-red-600">
                    Parent
                  </h3>
                  <p className="text-gray-600">
                    Track your child's journey
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition transform hover:scale-105 border-2 hover:border-blue-500"
              onClick={() => handleRoleSelect('school')}
            >
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <School className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-600">
                    School Admin
                  </h3>
                  <p className="text-gray-600">
                    Manage your school fleet
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition transform hover:scale-105 border-2 hover:border-orange-500"
              onClick={() => handleRoleSelect('driver')}
            >
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Bus className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-orange-600">
                    Driver
                  </h3>
                  <p className="text-gray-600">Manage your trips</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
