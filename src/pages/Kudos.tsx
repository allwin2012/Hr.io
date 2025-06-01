import { useState } from 'react';
import { Award, Heart, Plus, Search, Send, Star, ThumbsUp, Users, X } from 'lucide-react';

const Kudos = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [showSendForm, setShowSendForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const receivedKudos = [
    {
      id: 1,
      message: 'Thanks for helping with the design review yesterday. Your insights were invaluable!',
      from: 'Alex Johnson',
      date: 'May 29, 2025',
      type: 'appreciation'
    },
    {
      id: 2,
      message: 'Outstanding work on the new dashboard UI. The clients loved it!',
      from: 'Jane Smith',
      date: 'May 20, 2025',
      type: 'excellence'
    },
    {
      id: 3,
      message: 'Great teamwork on the product launch. Couldn\'t have done it without you.',
      from: 'Taylor Brown',
      date: 'May 15, 2025',
      type: 'teamwork'
    },
    {
      id: 4,
      message: 'Your dedication to quality is impressive. The attention to detail in your designs is outstanding.',
      from: 'Emily Rogers',
      date: 'May 10, 2025',
      type: 'excellence'
    }
  ];
  
  const sentKudos = [
    {
      id: 1,
      message: 'Great job on the presentation today!',
      to: 'Sam Williams',
      date: 'May 25, 2025',
      type: 'appreciation'
    },
    {
      id: 2,
      message: 'Thanks for helping me with the JavaScript issue.',
      to: 'Alex Johnson',
      date: 'May 12, 2025',
      type: 'teamwork'
    }
  ];
  
  const leaderboard = [
    { id: 1, name: 'Jane Smith', kudos: 12, avatar: null },
    { id: 2, name: 'Michael Anderson', kudos: 8, avatar: null },
    { id: 3, name: 'Alex Johnson', kudos: 7, avatar: null },
    { id: 4, name: 'Taylor Brown', kudos: 5, avatar: null },
    { id: 5, name: 'Sam Williams', kudos: 4, avatar: null },
  ];
  
  const [kudoForm, setKudoForm] = useState({
    recipient: '',
    message: '',
    type: 'appreciation',
  });
  
  const colleagues = [
    { id: 1, name: 'Jane Smith' },
    { id: 2, name: 'Alex Johnson' },
    { id: 3, name: 'Sam Williams' },
    { id: 4, name: 'Taylor Brown' },
    { id: 5, name: 'Emily Rogers' },
  ];
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKudoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit the form data
    setShowSendForm(false);
    // Reset form
    setKudoForm({
      recipient: '',
      message: '',
      type: 'appreciation',
    });
  };
  
  const getKudoIcon = (type: string) => {
    switch (type) {
      case 'appreciation':
        return <ThumbsUp size={20} className="text-blue-500" />;
      case 'excellence':
        return <Star size={20} className="text-yellow-500" />;
      case 'teamwork':
        return <Heart size={20} className="text-red-500" />;
      default:
        return <Award size={20} className="text-purple-500" />;
    }
  };
  
  const filteredKudos = activeTab === 'received' 
    ? receivedKudos.filter(kudo => kudo.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             kudo.from.toLowerCase().includes(searchTerm.toLowerCase()))
    : sentKudos.filter(kudo => kudo.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kudo.to.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kudos</h1>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowSendForm(true)}
        >
          <Plus size={16} />
          <span>Send Kudos</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('received')}
              >
                Received
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('sent')}
              >
                Sent
              </button>
            </div>
          </div>
          
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search kudos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredKudos.length > 0 ? (
              filteredKudos.map((kudo) => (
                <div key={kudo.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                      {getKudoIcon((kudo as any).type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300">"{(kudo as any).message}"</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {activeTab === 'received' ? `From: ${(kudo as any).from}` : `To: ${(kudo as any).to}`}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{(kudo as any).date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <Award size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>No kudos found.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="card">
            <div className="flex items-center mb-4">
              <Users size={18} className="mr-2 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Kudos Leaderboard</h2>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((person, index) => (
                <div key={person.id} className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{person.name}</p>
                  </div>
                  <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                    <Award size={14} className="text-green-600 dark:text-green-400 mr-1" />
                    <span className="text-green-600 dark:text-green-400 font-medium">{person.kudos}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {showSendForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Send Kudos</h2>
              <button 
                onClick={() => setShowSendForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipient
                </label>
                <select
                  name="recipient"
                  value={kudoForm.recipient}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a colleague</option>
                  {colleagues.map((colleague) => (
                    <option key={colleague.id} value={colleague.name}>
                      {colleague.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kudos Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input 
                      type="radio" 
                      name="type" 
                      value="appreciation" 
                      checked={kudoForm.type === 'appreciation'} 
                      onChange={handleFormChange} 
                      className="hidden" 
                    />
                    <div className={`flex flex-col items-center ${kudoForm.type === 'appreciation' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      <ThumbsUp size={24} className="mb-1" />
                      <span className="text-xs">Thanks</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input 
                      type="radio" 
                      name="type" 
                      value="excellence" 
                      checked={kudoForm.type === 'excellence'} 
                      onChange={handleFormChange} 
                      className="hidden" 
                    />
                    <div className={`flex flex-col items-center ${kudoForm.type === 'excellence' ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Star size={24} className="mb-1" />
                      <span className="text-xs">Excellence</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input 
                      type="radio" 
                      name="type" 
                      value="teamwork" 
                      checked={kudoForm.type === 'teamwork'} 
                      onChange={handleFormChange} 
                      className="hidden" 
                    />
                    <div className={`flex flex-col items-center ${kudoForm.type === 'teamwork' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Heart size={24} className="mb-1" />
                      <span className="text-xs">Teamwork</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={kudoForm.message}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Write your kudos message..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                >
                  <Send size={16} className="mr-2" />
                  Send Kudos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kudos;
