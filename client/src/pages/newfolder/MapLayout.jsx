import BottomNav from '../components/BottomNav';
import MapComponent from '../components/MapComponent';

const MapLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fcf8] text-[#0e1b0e]">
      {/* Header is globally included */}
      <div className="flex-grow p-0">
        {/* Adjusted the height dynamically to use the full available space, minus the BottomNav height */}
        <div className="rounded-2xl shadow-md border border-[#d0e7d1] bg-white w-full h-[calc(100vh-140px)] mx-auto overflow-hidden">
          <MapComponent />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MapLayout;
