import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: 'My Listings',
      path: '/my-listing',
    },
    {
      title: 'My Blog Posts',
      path: '/my-posts',
    },
    {
      title: 'Profile Settings',
      path: '/Profile',
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div className="flex-1">
        
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 mb-20">
          {/* Settings Options */}
          <div className="flex flex-col gap-4">
            {settingsOptions.map((option, index) => (
              <div 
                key={index}
                onClick={() => navigate(option.path)}
                className="flex justify-between items-center p-3 rounded-xl 
                         shadow-sm hover:shadow-md transition-all duration-300 
                         cursor-pointer hover:-translate-y-1 bg-white"
              >
                <h3 className="text-black font-medium">{option.title}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
