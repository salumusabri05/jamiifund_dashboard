'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiUsers, FiFlag, FiEdit, FiBarChart2, FiDollarSign, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

/**
 * Admin Dashboard Layout
 * 
 * Provides consistent layout across all admin pages
 * Features animated sidebar and header
 * Includes user profile and logout functionality
 */
const AdminLayout = ({ children, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { adminData, signOut } = useAuth();
  
  const menuItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/Home' },
    { icon: <FiUsers />, label: 'Verify Users', path: '/verify-users' },
    { icon: <FiFlag />, label: 'Verify Campaigns', path: '/verify-campaigns' },
    { icon: <FiEdit />, label: 'Manage Campaigns', path: '/manage-campaigns' },
    { icon: <FiEdit />, label: 'Blog Management', path: '/blog-management' },
    { icon: <FiBarChart2 />, label: 'Analytics', path: '/analytics' },
    { icon: <FiDollarSign />, label: 'Funds & Reports', path: '/funds' },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-purple-50">
        {/* Animated Sidebar */}
        <motion.div 
          className="bg-purple-800 text-white"
          initial={{ width: isSidebarOpen ? 250 : 70 }}
          animate={{ width: isSidebarOpen ? 250 : 70 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Logo and Menu Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-purple-700">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-xl"
              >
                JAMIIFUND
              </motion.div>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1">
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <Link href={item.path} key={index}>
                <motion.div
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-purple-700 transition-colors ${
                    currentPage === item.label ? 'bg-purple-600' : ''
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="ml-4"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>
          
          {/* Logout Button */}
          <div className="mt-auto mb-4">
            <motion.div
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-purple-700 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              onClick={signOut}
            >
              <span className="text-xl"><FiLogOut /></span>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="ml-4"
                >
                  Logout
                </motion.span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <motion.h1 
              className="text-2xl font-bold text-purple-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentPage}
            </motion.h1>
            
            {/* Admin Profile */}
            {adminData && (
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <p className="text-sm font-medium text-gray-900">{adminData.full_name}</p>
                  <p className="text-xs text-gray-500">{adminData.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  {adminData.avatar_url ? (
                    <img src={adminData.avatar_url} alt="Profile" className="h-10 w-10 rounded-full" />
                  ) : (
                    <FiUser className="text-purple-600" />
                  )}
                </div>
              </div>
            )}
          </header>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-purple-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;