interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar?: string;
}

interface TeamCardProps {
  manager: TeamMember;
  members: TeamMember[];
}

const TeamCard = ({ manager, members }: TeamCardProps) => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">My Team</h3>
      
      <div className="mb-4">
        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reports To</h4>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
            {manager.avatar ? (
              <img src={manager.avatar} alt={manager.name} className="h-10 w-10 rounded-full" />
            ) : (
              <span className="font-medium">{manager.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{manager.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{manager.role}</p>
          </div>
        </div>
      </div>
      
      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Team Members</h4>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full" />
              ) : (
                <span className="font-medium">{member.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{member.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
