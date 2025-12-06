import { useState, useEffect } from 'react';
import { userService,type User } from '../services/userService';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    campus: '',
    rolePreference: 'BOTH' as 'BUYER' | 'DELIVERER' | 'BOTH',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        campus: data.campus || '',
        rolePreference: data.rolePreference,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await userService.updateProfile(formData);
      setUser(updated);
      setEditing(false);
      // Update auth context
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({ ...userObj, ...updated }));
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updated = await userService.uploadProfilePic(file);
      setUser(updated);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({ ...userObj, ...updated }));
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to upload picture');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>

        {!editing ? (
          <>
            <div className="space-y-2 mb-4">
              <div><span className="font-medium">Name:</span> {user.name}</div>
              <div><span className="font-medium">Email:</span> {user.email}</div>
              <div><span className="font-medium">Phone:</span> {user.phone || 'Not provided'}</div>
              <div><span className="font-medium">Campus:</span> {user.campus || 'Not provided'}</div>
              <div><span className="font-medium">Role Preference:</span> {user.rolePreference}</div>
              <div><span className="font-medium">Rating:</span> {user.rating > 0 ? `★ ${user.rating.toFixed(1)}` : 'No ratings yet'}</div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
              <input
                type="text"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Preference</label>
              <select
                name="rolePreference"
                value={formData.rolePreference}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="BOTH">Both</option>
                <option value="BUYER">Buyer Only</option>
                <option value="DELIVERER">Deliverer Only</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: user.name,
                    phone: user.phone || '',
                    campus: user.campus || '',
                    rolePreference: user.rolePreference,
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

