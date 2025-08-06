import React from 'react';

/**
 * Recent Activity Component
 * 
 * Displays a list of recent user activities from Supabase
 * Shows loading state while data is being fetched
 * 
 * @param {Array} activities - List of activity objects from Supabase
 * @param {boolean} loading - Loading state while data is being fetched
 */
const RecentActivity = ({ activities = [], loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">Recent Activity</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-500">No recent activities found.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-b border-gray-100 pb-2">
              <p className="text-gray-600">{activity.description}</p>
              <p className="text-sm text-gray-400">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;