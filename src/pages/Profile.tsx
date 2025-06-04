import { useState, useRef ,useEffect} from 'react';
import { Building, Mail, MapPin, Phone, Upload, User, Users } from 'lucide-react';
import { useSnackbar } from '../contexts/SnackbarContext';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Michael Anderson',
    email: 'michael.anderson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Design',
    role: 'Senior UI Designer',
    location: 'San Francisco, CA',
    joinDate: '2020-03-15',
    status: 'Active',
    bio: 'Experienced UI Designer with a passion for creating intuitive and beautiful user interfaces.',
    avatar: null,
  });
  
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();
  const [manager, setManager] = useState<any>(null);
const [teamMembers, setTeamMembers] = useState<any[]>([]);

  
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setProfileData(prev => ({
    ...prev,
    [name]: value,
  }));
};

// API_BASE_URL is the base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setEditing(false);

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT', // ✅ required!
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData), // ✅ needed for PUT
    });

    if (!response.ok) throw new Error('Failed to save profile');

    const updated = await response.json();
    setProfileData(updated); // ✅ update UI
    showSnackbar('Profile saved successfully', 'success');
  } catch (error) {
    console.error('Error saving profile:', error);
    showSnackbar('Failed to save profile', 'error');
  }
};
  

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      const formData = new FormData();
      formData.append('avatar', file);
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/upload-avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
  
        if (!response.ok) throw new Error('Upload failed');
  
        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
          avatar: data.avatarUrl, // this should be the returned file URL
        }));
        showSnackbar('Avatar uploaded successfully', 'success');
      } catch (err) {
        console.error('Upload error:', err);
        showSnackbar('Failed to upload avatar', 'error');
      }
    }
  };
  

  // Top-level useEffect (NOT inside another function)
useEffect(() => {
  const fetchHierarchy = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me/hierarchy`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch hierarchy');
      const data = await response.json();
      setManager(data.manager);
      setTeamMembers(data.teamMembers);
    } catch (err) {
      console.error('Failed to fetch hierarchy:', err);
    }
  };

  fetchHierarchy();
}, []);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) throw new Error('Failed to fetch profile');
  
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile();
  }, []);


  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex flex-col items-center p-6">
          <div className="relative mb-4">
            <div 
              className="h-32 w-32 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handlePhotoClick}
            >
              {profileData.avatar ? (
                <img 
                src={`${API_BASE_URL}${profileData.avatar}`}
                  alt={profileData.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300">
                  <User size={64} />
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600"
              onClick={handlePhotoClick}
            >
              <Upload size={18} className="text-green-600 dark:text-green-400" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{profileData.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{profileData.role}</p>
          
          <div className="mt-4 w-full">
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                {profileData.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Join Date</span>
              <span className="text-gray-800 dark:text-gray-200">
                {new Date(profileData.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
            <button 
              onClick={() => setEditing(!editing)}
              className="btn btn-outline"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="role"
                    value={profileData.role}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={profileData.status}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                disabled={!editing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            
            {editing && (
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
        
        <div className="card md:col-span-3">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Team Hierarchy</h2>
          
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
              <Users size={16} className="mr-2" /> Reports To
            </h3>
            <div className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
  {manager ? (
    manager.avatar ? (
      <img src={`${API_BASE_URL}${manager.avatar}`} alt={manager.name} className="h-12 w-12 rounded-full" />
    ) : (
      <span className="font-medium text-lg">{manager.name?.charAt(0)}</span>
    )
  ) : (
    <span className="text-sm text-gray-400">Loading...</span>
  )}
</div>

<div>
  <p className="font-medium text-gray-800 dark:text-white">
    {manager ? manager.name : 'Loading...'}
  </p>
  <p className="text-sm text-gray-500 dark:text-gray-400">
    {manager ? manager.role : ''}
  </p>
</div>

            </div>
          </div>
          
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
            <Users size={16} className="mr-2" /> Team Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {teamMembers.length > 0 ? (
    teamMembers.map((member) => (
      <div key={member.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
          {member.avatar ? (
            <img src={`${API_BASE_URL}${member.avatar}`} alt={member.name} className="h-10 w-10 rounded-full" />
          ) : (
            <span className="font-medium">{member.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-white">{member.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
        </div>
      </div>
    ))
  ) : (
    <>
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
