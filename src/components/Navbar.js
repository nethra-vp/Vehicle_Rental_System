'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, User, LogOut, LayoutDashboard, History } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = role === 'admin' 
    ? [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Vehicles', href: '/admin/vehicles', icon: Car },
        { label: 'Bookings', href: '/admin/bookings', icon: History },
      ]
    : [
        { label: 'Browse', href: '/user/dashboard', icon: Car },
        { label: 'My Bookings', href: '/user/bookings', icon: History },
      ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Drive<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                pathname === item.href 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">{user?.name || 'Guest'}</span>
            <span className="text-xs text-slate-500 capitalize">{role} Portal</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
