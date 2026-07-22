'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role: 'admin' })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/admin/dashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-slate-900" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center text-slate-900">Admin Login</h1>
        <p className="text-center text-slate-500 mb-6">Secure portal access for administrators.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-500" placeholder="Admin name" type="text" name="name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-500" placeholder="Admin email" type="email" name="email" required />
          </div>
          <button disabled={loading} className="w-full bg-slate-900 text-white p-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors mt-2 disabled:opacity-50" type="submit">
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
