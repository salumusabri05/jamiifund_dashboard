'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabaseClient';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSave, FiX } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'

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
  const { admin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    slug: '',
    category: '',
    published: false,
    publish_date: new Date().toISOString().split('T')[0],
    metaDescription: '',
    keywords: ''
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const categories = [
    'Community',
    'Education',
    'Fundraising',
    'Success Stories',
    'News',
    'Events',
    'Other'
  ];
  
  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
  ;
  
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
    
    // Auto-generate slug from title
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featured_image: '',
      slug: '',
      category: '',
      published: false,
      publish_date: new Date().toISOString().split('T')[0],
      metaDescription: '',
      keywords: ''
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
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      slug: post.slug || '',
      category: post.category || '',
      published: post.published || false,
      publish_date: post.publish_date ? post.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
      metaDescription: post.metaDescription || '',
      keywords: post.keywords || ''
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
      setError(null);
      
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Please enter a title');
      }
      if (!formData.content.trim()) {
        throw new Error('Please enter content');
      }
      if (!formData.slug.trim()) {
        throw new Error('Please enter a URL slug');
      }
      
      // Check slug uniqueness
      const isSlugUnique = await checkSlugUniqueness(formData.slug);
      if (!isSlugUnique) {
        throw new Error('This URL slug is already in use. Please choose another one.');
      }
      
      if (currentPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            featured_image: formData.featured_image,
            slug: formData.slug,
            category: formData.category,
            published: formData.published,
            publish_date: formData.publish_date,
            metaDescription: formData.metaDescription,
            keywords: formData.keywords,
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
            excerpt: formData.excerpt,
            content: formData.content,
            featured_image: formData.featured_image,
            slug: formData.slug,
            category: formData.category,
            published: formData.published,
            publish_date: formData.publish_date,
            metaDescription: formData.metaDescription,
            keywords: formData.keywords,
            author_id: admin?.id || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          if (error.code === '23505') {
            throw new Error('A post with this URL slug already exists. Please use a different slug.');
          }
          throw error;
        }
      }
      
      fetchBlogPosts();
      setShowEditor(false);
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError(error.message || 'Failed to save blog post');
    }
  };

  // Add a function to handle image uploads
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('public')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('public')
        .getPublicUrl(filePath);
        
      // Set the image URL in form data
      setFormData({
        ...formData,
        featured_image: data.publicUrl
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPost = (post) => {
    setCurrentPost(post);
    setPreviewMode(true);
  };

  // Check slug uniqueness
  const checkSlugUniqueness = async (slug) => {
    if (!slug) return true;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) return false;
    
    // If editing an existing post, the post can keep its own slug
    if (data && currentPost && data.id === currentPost.id) {
      return true;
    }
    
    return !data;
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
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
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
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {post.category && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-2">
                        {post.category}
                      </span>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {post.published 
                          ? `Published: ${new Date(post.publish_date).toLocaleDateString()}`
                          : `Last edited: ${new Date(post.updated_at).toLocaleDateString()}`
                        }
                      </span>
                      <div className="flex space-x-2">
                        <motion.button
                          className="text-purple-600 hover:text-purple-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePreviewPost(post)}
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
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                  </div>
                )}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                    URL Slug
                  </label>
                  <div className="flex">
                    <span className="bg-gray-100 border-2 border-r-0 border-purple-200 rounded-l-md p-2 text-gray-500">
                      /blog/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      className="w-full border-2 border-purple-200 rounded-r-md p-2"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
                    Excerpt
                  </label>
                  <input
                    type="text"
                    id="excerpt"
                    name="excerpt"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    maxLength={200}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="featured_image">
                    Featured Image
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="featured_image"
                      name="featured_image"
                      className="w-full border-2 border-purple-200 rounded-l-md p-2"
                      value={formData.featured_image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL or upload"
                    />
                    <label className="bg-purple-600 text-white px-4 py-2 rounded-r-md cursor-pointer hover:bg-purple-700">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {formData.featured_image && (
                    <div className="mt-2 relative h-32 w-full bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={formData.featured_image} 
                        alt="Preview" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full border-2 border-purple-200 rounded-md p-2"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
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
                  <div className="flex items-center justify-start pt-8">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      className="h-4 w-4 text-purple-600 border-2 border-purple-200 rounded mr-2"
                      checked={formData.published}
                      onChange={handleCheckboxChange}
                    />
                    <label className="text-gray-700 text-sm font-bold" htmlFor="published">
                      Published
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaDescription">
                    Meta Description (for SEO)
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    className="w-full border-2 border-purple-200 rounded-md p-2"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    maxLength={160}
                    rows={2}
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                  </label>
                  <ReactQuill
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    className="h-64 mb-12" // Extra margin to accommodate Quill toolbar
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
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
                    {formData.published ? 'Publish' : 'Save Draft'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Blog Post Preview Modal */}
      {previewMode && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPreviewMode(false)}
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
                  Preview: {currentPost.title}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setPreviewMode(false)}
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {currentPost.featured_image && (
                <div className="mb-6 h-64 overflow-hidden rounded-lg">
                  <img 
                    src={currentPost.featured_image} 
                    alt={currentPost.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <h1>{currentPost.title}</h1>
                {currentPost.category && (
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-4">
                    {currentPost.category}
                  </span>
                )}
                <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default BlogManagementPage;