export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">892</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Recent Updates</h3>
          <p className="text-3xl font-bold text-purple-600">5</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-gray-600">Updated hero section - 2 hours ago</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">New user registered - 4 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}