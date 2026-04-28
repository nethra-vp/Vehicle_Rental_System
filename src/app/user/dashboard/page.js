'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VehicleCard from '@/components/VehicleCard';
import BookingModal from '@/components/BookingModal';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicles${query}`);
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const query = `?location=${filters.location}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`;
    fetchVehicles(query);
  };

  const clearFilters = () => {
    setFilters({ location: '', minPrice: '', maxPrice: '' });
    fetchVehicles();
  };

  return (
    <>
      <Navbar role="user" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
              Premium <span className="text-indigo-600">Vehicles</span> Ready for You
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Explore our diverse fleet of top-tier cars, EVs, and SUVs. Best prices guaranteed.
            </p>
          </div>
          
          <form onSubmit={handleFilter} className="w-full md:w-auto bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2">
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-500 mr-2" />
              <input 
                type="text" 
                placeholder="Location..."
                className="outline-none text-sm w-32 text-slate-700"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            <div className="flex items-center px-4 py-2">
              <span className="text-sm font-bold text-slate-400 mr-2">₹</span>
              <input 
                type="number" 
                placeholder="Max price"
                className="outline-none text-sm w-24 text-slate-700"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <button 
              type="submit"
              className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold px-1">Search</span>
            </button>
            {(filters.location || filters.maxPrice) && (
              <button 
                type="button"
                onClick={clearFilters}
                className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-all"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <VehicleCard 
                  key={v._id} 
                  vehicle={v} 
                  onBook={(vehicle) => setSelectedVehicle(vehicle)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No vehicles found</h3>
                <p className="text-slate-500">Try adjusting your filters or location.</p>
              </div>
            )}
          </div>
        )}

        {selectedVehicle && (
          <BookingModal 
            vehicle={selectedVehicle} 
            onClose={() => setSelectedVehicle(null)}
            onSuccess={() => {
              setSelectedVehicle(null);
              router.push('/user/bookings');
            }}
          />
        )}
      </div>
    </>
  );
}
