export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">SaaS Admin Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">MRR</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">R$ 0,00</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Churn</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Erros</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
        </div>
      </div>
    </div>
  );
}
