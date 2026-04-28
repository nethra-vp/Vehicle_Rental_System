'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, MapPin, Fuel, Users } from 'lucide-react';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', pricePerDay: '', fuelType: 'Petrol', 
    seatingCapacity: '', location: '', images: ['']
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
      images: vehicle.images.length > 0 ? vehicle.images : ['']
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchVehicles();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingVehicle ? 'PUT' : 'POST';
    const url = editingVehicle ? `/api/vehicles/${editingVehicle._id}` : '/api/vehicles';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingVehicle(null);
        setFormData({ name: '', brand: '', pricePerDay: '', fuelType: 'Petrol', seatingCapacity: '', location: '', images: [''] });
        fetchVehicles();
      }
    } catch (err) {
      alert('Save failed');
    }
  };

  return (
    <>
      <Navbar role="admin" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Vehicle <span className="text-indigo-600">Inventory</span></h1>
            <p className="text-slate-500">Add, edit, or remove vehicles from your collection.</p>
          </div>
          <button 
            onClick={() => { setEditingVehicle(null); setFormData({ name: '', brand: '', pricePerDay: '', fuelType: 'Petrol', seatingCapacity: '', location: '', images: [''] }); setShowModal(true); }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Vehicle
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div key={v._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEdit(v)} className="p-2 bg-white rounded-xl shadow-lg text-slate-600 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(v._id)} className="p-2 bg-white rounded-xl shadow-lg text-slate-600 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{v.name}</h3>
                      <p className="text-slate-400 text-sm font-medium">{v.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-600">₹{v.pricePerDay}</span>
                      <span className="text-slate-400 text-xs block">/ day</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.location}</span>
                    <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {v.fuelType}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {v.seatingCapacity} Seats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10">
                <X className="w-6 h-6 text-slate-400" />
              </button>
              <form onSubmit={handleSubmit} className="p-10">
                <h2 className="text-3xl font-black mb-8 text-slate-900">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price Per Day (₹)</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-slate-700" value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})}>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>EV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Seating Capacity</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none   text-slate-700" value={formData.seatingCapacity} onChange={(e) => setFormData({...formData, seatingCapacity: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                    <div className="flex gap-2">
                      <div className="flex-grow relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="url" required className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" placeholder="https://..." value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} />
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all mt-4">
                  {editingVehicle ? 'Update Vehicle' : 'Add to Inventory'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
