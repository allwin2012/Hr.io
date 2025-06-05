import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
}

const TeamCard = () => {
  const [manager, setManager] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  return (
    <div className="card p-6 shadow-lg bg-white dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">My Team</h3>

      <div className="mb-6">
        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reports To</h4>
        {manager ? (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              {manager.avatar ? (
                <img src={`${API_BASE_URL}${manager.avatar}`} alt={manager.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="font-medium text-lg">{manager.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{manager.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{manager.role}</p>
            </div>
          </div>
        ) : loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <p className="text-sm text-gray-400">No manager assigned</p>
        )}
      </div>

      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Team Members</h4>
      <div className="space-y-4">
        {teamMembers.length === 0 && !loading && (
          <p className="text-sm text-gray-400">No team members assigned</p>
        )}

        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-300 mr-3"></div>
              <div className="space-y-1">
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
                <div className="h-2 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          teamMembers.map((member) => (
            <div key={member._id} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                {member.avatar ? (
                  <img src={`${API_BASE_URL}${member.avatar}`} alt={member.name} className="h-8 w-8 rounded-full object-cover" />
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
        )}
      </div>
    </div>
  );
};

export default TeamCard;
