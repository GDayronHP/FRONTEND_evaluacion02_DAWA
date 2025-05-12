import React from 'react';
import Navbar from '../components/NavBar';
import { useAuth } from '../../modules/auth/context/AuthContext';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {currentUser && <Navbar />}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;