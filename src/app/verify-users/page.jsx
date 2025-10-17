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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
  fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      // Fetch verification requests with pending status
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (data) {
        // Debug: log all status values to console
        console.log('Verification request statuses:', data.map(r => r.status));
      }
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status, reason = '') => {
    try {
      const updateObj = { status };
      if (status === 'rejected') {
        updateObj.rejection_reason = reason;
      }
      const { error } = await supabase
        .from('verification_requests')
        .update(updateObj)
        .eq('id', requestId);
      if (error) throw error;
      fetchPendingRequests();
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const filteredRequests = requests.filter(req =>
    (req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     req.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            {filteredRequests.length > 0 ? (
              filteredRequests.map(req => (
                <motion.div
                  key={req.id}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  onClick={() => setSelectedRequest(req)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                      {req.full_name?.charAt(0) || req.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{req.full_name || req.organization_name}</h3>
                      <p className="text-sm text-gray-500">{req.email}</p>
                      {req.is_organization && (
                        <span className="text-xs text-blue-600 ml-2">Organization</span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <p className="text-sm text-gray-600">Requested on: {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}</p>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                      Pending Verification
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pending verification requests found.
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Verification Request Details Modal */}
      {selectedRequest && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedRequest(null)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-purple-800">Verification Request Details</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium">{selectedRequest.full_name || selectedRequest.organization_name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium">{selectedRequest.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="font-medium">{selectedRequest.phone || selectedRequest.phone_number || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium">{selectedRequest.date_of_birth || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">National ID</p>
              <p className="font-medium">{selectedRequest.national_id || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{selectedRequest.address || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Bank Account</p>
              <p className="font-medium">{selectedRequest.bank_account || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Bank Name</p>
              <p className="font-medium">{selectedRequest.bank_name || 'Not provided'}</p>
            </div>
            {selectedRequest.is_organization && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Organization Name</p>
                  <p className="font-medium">{selectedRequest.organization_name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Organization Reg. Number</p>
                  <p className="font-medium">{selectedRequest.organization_reg_number}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Organization Address</p>
                  <p className="font-medium">{selectedRequest.organization_address}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Organization Bank Account</p>
                  <p className="font-medium">{selectedRequest.organization_bank_account}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Organization Bank Name</p>
                  <p className="font-medium">{selectedRequest.organization_bank_name}</p>
                </div>
              </>
            )}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Document Type</p>
              <p className="font-medium">{selectedRequest.document_type || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="font-medium">{selectedRequest.notes || 'None'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Selfie</p>
              {selectedRequest.selfie_url ? (
                <img src={selectedRequest.selfie_url} alt="Selfie" className="w-24 h-24 object-cover rounded" />
              ) : 'Not provided'}
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">ID Document</p>
              {selectedRequest.id_document_url ? (
                <a href={selectedRequest.id_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a>
              ) : 'Not provided'}
            </div>
            {selectedRequest.is_organization && selectedRequest.organization_logo_url && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Organization Logo</p>
                <img src={selectedRequest.organization_logo_url} alt="Logo" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
            {selectedRequest.is_organization && selectedRequest.organization_document_url && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Organization Document</p>
                <a href={selectedRequest.organization_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a>
              </div>
            )}
            <div className="flex flex-col gap-3 mt-6">
              <motion.button
                className="bg-green-100 text-green-600 px-4 py-2 rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
              >
                <FiCheckCircle className="mr-2" />
                Approve
              </motion.button>
              <div className="flex flex-col gap-2">
                <textarea
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Rejection reason (required to reject)"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  rows={2}
                />
                <motion.button
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!rejectionReason.trim()}
                  onClick={() => updateRequestStatus(selectedRequest.id, 'rejected', rejectionReason)}
                >
                  <FiXCircle className="mr-2" />
                  Reject
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default VerifyUsersPage;