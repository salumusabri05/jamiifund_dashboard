'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';

/**
 * Verify Users Page
 * 
 * Admin interface for verifying user credentials
 * Features:
 * - Filtering and searching users
 * - Approving or rejecting user accounts
 * - Viewing user details
 */
const VerifyUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      // Fetch users with pending verification status
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId, status) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ verification_status: status })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Refresh the user list
      fetchPendingUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AdminLayout currentPage="Verify Users">
      <div className="mb-6">
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center border-2 border-purple-200 rounded-md px-3 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search users by name or email"
              className="flex-1 outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <motion.div
                  key={user.id}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.full_name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <p className="text-sm text-gray-600">Registered on: {new Date(user.created_at).toLocaleDateString()}</p>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                      Pending Verification
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pending users found to verify.
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedUser(null)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-purple-800">User Verification</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium">{selectedUser.full_name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium">{selectedUser.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Registration Date</p>
              <p className="font-medium">{new Date(selectedUser.created_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => verifyUser(selectedUser.id, 'rejected')}
              >
                <FiXCircle className="mr-2" />
                Reject
              </motion.button>
              <motion.button
                className="bg-green-100 text-green-600 px-4 py-2 rounded-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => verifyUser(selectedUser.id, 'approved')}
              >
                <FiCheckCircle className="mr-2" />
                Approve
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default VerifyUsersPage;