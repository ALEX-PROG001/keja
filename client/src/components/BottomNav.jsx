import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleProfileClick = (e) => {
    e.preventDefault();
    
    console.log('Persisted user state:', currentUser);

    if (!currentUser?._id) {
      console.log('No authenticated user found');
      navigate('/sign-in');
      return;
    }

    navigate('/settings');
  };

  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 flex gap-2 border-t border-[#EEEEEE] bg-[#FFFFFF] px-4 pb-3 pt-2">
        {/* Blog */}
        <Link 
          to="/blog" 
          className={`flex flex-1 flex-col items-center justify-end gap-1 
            ${location.pathname === '/blog' ? 'text-black' : 'text-[#6B6B6B]'}
            hover:text-black transition-colors duration-200`}
        >
          <div className="flex h-8 items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              className={`${location.pathname === '/blog' ? 'fill-black' : 'fill-[#6B6B6B]'} 
                hover:fill-black transition-colors duration-200`}
              viewBox="0 0 256 256"
            >
              <path d="M48,40V200a16,16,0,0,0,16,16H208a8,8,0,0,0,8-8V48a8,8,0,0,0-8-8H64A16,16,0,0,0,48,40Zm8,0H200V200H64V40ZM88,56h96V72H88Zm0,32h96v16H88Zm0,32h96v16H88Z" />
            </svg>
          </div>
          <p className="text-xs font-medium leading-normal tracking-[0.015em]">Blog</p>
        </Link>

        {/* Saved */}
        <Link 
          to="/saved-listings" 
          className={`flex flex-1 flex-col items-center justify-end gap-1 
            ${location.pathname === '/saved-listings' ? 'text-black' : 'text-[#6B6B6B]'}
            hover:text-black transition-colors duration-200`}
        >
          <div className="flex h-8 items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              className={`${location.pathname === '/saved-listings' ? 'fill-black' : 'fill-[#6B6B6B]'} 
                hover:fill-black transition-colors duration-200`}
              viewBox="0 0 256 256"
            >
              <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.76,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z" />
            </svg>
          </div>
          <p className="text-xs font-medium leading-normal tracking-[0.015em]">Saved</p>
        </Link>

        {/* Home */}
        <Link 
          to="/" 
          className={`flex flex-1 flex-col items-center justify-end gap-1 
            ${location.pathname === '/' ? 'text-black' : 'text-[#6B6B6B]'}
            hover:text-black transition-colors duration-200`}
        >
          <div className="flex h-8 items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              className={`${location.pathname === '/' ? 'fill-black' : 'fill-[#6B6B6B]'} 
                hover:fill-black transition-colors duration-200`}
              viewBox="0 0 256 256"
            >
              <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
            </svg>
          </div>
          <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
        </Link>

        {/* Search */}
        <Link 
          to="/search" 
          className={`flex flex-1 flex-col items-center justify-end gap-1 
            ${location.pathname === '/search' ? 'text-black' : 'text-[#6B6B6B]'}
            hover:text-black transition-colors duration-200`}
        >
          <div className="flex h-8 items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              className={`${location.pathname === '/search' ? 'fill-black' : 'fill-[#6B6B6B]'} 
                hover:fill-black transition-colors duration-200`}
              viewBox="0 0 256 256"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          <p className="text-xs font-medium leading-normal tracking-[0.015em]">Search</p>
        </Link>
        {/* Profile */}
        <Link
          to="#"
          onClick={handleProfileClick}
          className={`flex flex-1 flex-col items-center justify-end gap-1 
            ${location.pathname === '/settings' ? 'text-black' : 'text-[#6B6B6B]'}
            hover:text-black transition-colors duration-200`}
        >
          <div className="flex h-8 items-center justify-center">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className={`${location.pathname === '/settings' ? 'fill-black' : 'fill-[#6B6B6B]'} hover:fill-black transition-colors duration-200`}
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" />
              </svg>
            )}
          </div>
          <p className="text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
        </Link>
      </div>
      <div className="h-5 bg-[#FFFFFF]" />
    </div>
  );
}
