export default function UserLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="p-8 bg-white shadow rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">User Login (Dummy)</h1>
        <div className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" />
          <button className="w-full bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
