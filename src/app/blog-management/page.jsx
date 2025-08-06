'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import supabase from '../../lib/supabaseClient';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSave, FiX } from 'react-icons/fi';

/**
 * Blog Management Page
 * 
 * Admin interface for creating and managing blog posts
 * Features:
 * - Rich text editor for content creation
 * - Image upload capability
 * - Post scheduling
 * - Draft saving
 */
const BlogManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    status: 'draft',
    publish_date: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      image_url: '',
      status: 'draft',
      publish_date: new Date().toISOString().split('T')[0]
    });
    setCurrentPost(null);
  };

  const handleNewPost = () => {
    resetForm();
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title || '',
      summary: post.summary || '',
      content: post.content || '',
      image_url: post.image_url || '',
      status: post.status || 'draft',
      publish_date: post.publish_date ? post.publish_date.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowEditor(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);
        
        if (error) throw error;
        fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            summary: formData.summary,
            content: formData.content,
            image_url: formData.image_url,
            status: formData.status,
            publish_date: formData.publish_date,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPost.id);
        
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            summary: formData.summary,
            content: formData.content,
            image_url: formData.image_url,
            status: formData.status,
            publish_date: formData.publish_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      fetchBlogPosts();
      setShowEditor(false);
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AdminLayout currentPage="Blog Management">
      <div className="mb-6">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-purple-800">Blog Posts</h2>
          <motion.button
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewPost}
          >
            <FiPlus className="mr-2" />
            New Post
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.length > 0 ? (
              posts.map(post => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="h-40 bg-purple-100 overflow-hidden">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-400">
                        <span className="text-6xl font-light">JAMIIFUND</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-purple-800">{post.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {post.status === 'published' 
                          ? `Published: ${new Date(post.publish_date).toLocaleDateString()}`
                          : `Last edited: ${new Date(post.updated_at).toLocaleDateString()}`
                        }
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          className="text-purple-600 hover:text-purple-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEye size={18} />
                        </motion.button>
                        <motion.button
                          className="text-blue-600 hover:text-blue-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditPost(post)}
                        >
                          <FiEdit2 size={18} />
                        </motion.button>
                        <motion.button
                          className="text-red-600 hover:text-red-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No blog posts found. Create your first post!
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Blog Editor Modal */}
      {showEditor && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800">
                  {currentPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEditor(false)}
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
                    Summary
                  </label>
                  <input
                    type="text"
                    id="summary"
                    name="summary"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="w-full border-2 border-purple-200 rounded-md p-2"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publish_date">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      id="publish_date"
                      name="publish_date"
                      className="w-full border-2 border-purple-200 rounded-md p-2"
                      value={formData.publish_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    className="w-full border-2 border-purple-200 rounded-md p-2 h-64"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditor(false)}
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSave className="mr-2" />
                    {formData.status === 'published' ? 'Publish' : 'Save Draft'}
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

export default BlogManagementPage;