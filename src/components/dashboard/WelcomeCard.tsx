import { format } from 'date-fns';

interface WelcomeCardProps {
  name: string;
  role: string;
}
const getTimeEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅';       // Morning
  if (hour < 17) return '🌞';       // Afternoon
  if (hour < 21) return '🌆';       // Evening
  return '🌇';                      // Evening
};
const WelcomeCard = ({ name, role }: WelcomeCardProps) => {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const emoji = getTimeEmoji();
  
  return (
    <div className="card bg-gradient-to-r from-green-600 to-green-500 dark:from-green-800 dark:to-green-700 text-white p-6 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
        <h1 className="text-2xl font-bold">Hi {name}, {emoji}</h1>
          <p className="text-green-100">{role}</p>
          <p className="mt-1 text-green-100 text-sm">{today}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Check In
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
