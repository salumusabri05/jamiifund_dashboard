'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { FiEdit2, FiTrash2, FiEye, FiFilter, FiSearch } from 'react-icons/fi';

/**
 * Manage Campaigns Page
 * 
 * Admin interface for editing and deleting campaigns
 * Features:
 * - Filtering campaigns by status
 * - Searching for specific campaigns
 * - Editing campaign details
 * - Deleting campaigns
 */
const ManageCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    end_date: '',
    status: '',
    is_featured: false
  });

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  // Modify the fetchCampaigns function to ensure all campaigns are retrieved
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Only apply status filter when not "all"
      if (statusFilter !== 'all') {
        query = query.eq('is_featured', statusFilter === 'true');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Log the number of campaigns retrieved for debugging
      console.log(`Retrieved ${data?.length || 0} campaigns`);
      
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'goal_amount' ? parseInt(value, 10) || '' : value
    });
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title || '',
      description: campaign.description || '',
      category: campaign.category || '',
      goal_amount: campaign.goal_amount || '',
      end_date: campaign.end_date ? campaign.end_date.split('T')[0] : '',
      status: campaign.status || '',
      is_featured: campaign.is_featured || false
    });
    setEditMode(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          goal_amount: formData.goal_amount,
          end_date: formData.end_date,
          status: formData.status,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCampaign.id);
      
      if (error) throw error;
      
      fetchCampaigns();
      setEditMode(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', campaignId);
        
        if (error) throw error;
        
        fetchCampaigns();
        setSelectedCampaign(null);
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  // Update the filtering logic to be more inclusive
  const filteredCampaigns = searchTerm.trim() === '' 
    ? campaigns 
    : campaigns.filter(campaign => 
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AdminLayout currentPage="Manage Campaigns">
      <div className="mb-6">
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-md mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center border-2 border-purple-200 rounded-md px-3 py-2 flex-1">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search campaigns"
                className="flex-1 outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center border-2 border-purple-200 rounded-md px-3 py-2 w-full md:w-64">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                className="flex-1 outline-none bg-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Campaigns</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Creator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Goal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map(campaign => (
                      <motion.tr key={campaign.id} variants={itemVariants}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {campaign.image_url ? (
                              <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                                <img src={campaign.image_url} alt="" className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                                <span className="text-purple-700">{campaign.title?.charAt(0) || '?'}</span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{campaign.title}</div>
                              <div className="text-xs text-gray-500">{new Date(campaign.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{campaign.user?.full_name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{campaign.user?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${campaign.goal_amount?.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${campaign.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              campaign.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <motion.button
                              className="text-purple-600 hover:text-purple-900"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              <FiEye size={18} />
                            </motion.button>
                            <motion.button
                              className="text-blue-600 hover:text-blue-900"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditCampaign(campaign)}
                            >
                              <FiEdit2 size={18} />
                            </motion.button>
                            <motion.button
                              className="text-red-600 hover:text-red-900"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCampaign(campaign.id)}
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No campaigns found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-purple-50 text-sm text-purple-800">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </div>
          </motion.div>
        )}
      </div>

      {/* View Campaign Modal */}
      {selectedCampaign && !editMode && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCampaign(null)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            {selectedCampaign.image_url && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={selectedCampaign.image_url} 
                  alt={selectedCampaign.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">{selectedCampaign.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Created by: {selectedCampaign.user?.full_name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(selectedCampaign.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 mb-4">{selectedCampaign.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Goal Amount</p>
                  <p className="font-bold text-purple-800">${selectedCampaign.goal_amount?.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Current Amount</p>
                  <p className="font-bold text-purple-800">${selectedCampaign.current_amount?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Campaign Duration</p>
                  <p className="font-bold text-purple-800">
                    {selectedCampaign.end_date ? 
                      `Until ${new Date(selectedCampaign.end_date).toLocaleDateString()}` : 
                      'Ongoing'}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-bold text-purple-800">{selectedCampaign.category || 'Uncategorized'}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Donor Count</p>
                  <p className="font-bold text-purple-800">{selectedCampaign.donor_count || 0}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Featured</p>
                  <p className="font-bold text-purple-800">{selectedCampaign.is_featured ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-end space-x-3">
                <motion.button
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                >
                  <FiTrash2 className="mr-2" />
                  Delete Campaign
                </motion.button>
                <motion.button
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditCampaign(selectedCampaign)}
                >
                  <FiEdit2 className="mr-2" />
                  Edit Campaign
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Campaign Modal */}
      {editMode && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEditMode(false)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Edit Campaign</h2>
              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full border-2 border-purple-200 rounded-md p-2 h-32"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Education">Education</option>
                    <option value="Medical">Medical</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Community">Community</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="goal_amount">
                    Goal Amount ($)
                  </label>
                  <input
                    type="number"
                    id="goal_amount"
                    name="goal_amount"
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.goal_amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    className="h-4 w-4 text-purple-600 border-2 border-purple-200 rounded mr-2"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  />
                  <label className="text-gray-700 text-sm font-bold" htmlFor="is_featured">
                    Feature this campaign on homepage
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <motion.button
                    type="button"
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default ManageCampaignsPage;