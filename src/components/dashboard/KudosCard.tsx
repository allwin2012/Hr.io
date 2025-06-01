import { Heart, Star, ThumbsUp } from 'lucide-react';

interface Kudo {
  id: number;
  message: string;
  from: string;
  date: string;
  type: 'appreciation' | 'excellence' | 'teamwork';
}

interface KudosCardProps {
  kudos: Kudo[];
}

const KudosCard = ({ kudos }: KudosCardProps) => {
  const getKudoIcon = (type: string) => {
    switch (type) {
      case 'appreciation':
        return <ThumbsUp size={16} className="text-blue-500" />;
      case 'excellence':
        return <Star size={16} className="text-yellow-500" />;
      case 'teamwork':
        return <Heart size={16} className="text-red-500" />;
      default:
        return <ThumbsUp size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="card animate-[fadeIn_0.7s_ease-in-out]">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Recent Kudos</h3>
      
      {kudos.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>No kudos received yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {kudos.map((kudo) => (
            <div 
              key={kudo.id} 
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                  {getKudoIcon(kudo.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">"{kudo.message}"</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">From: {kudo.from}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{kudo.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KudosCard;
