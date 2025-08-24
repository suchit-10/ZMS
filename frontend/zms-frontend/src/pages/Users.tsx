import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const Users = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
          <div className="flex items-center justify-between mb-4">
            <Header title="Users" subtitle="Manage system users and permissions" />
          </div>

          <section>
            <div className="py-20">
              <div className="max-w-2xl mx-auto text-center p-8 bg-white/60 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Users API Available</h3>
                <p className="text-sm text-gray-600 mb-6">
                  The backend has users API endpoints, but they are currently returning mock data only. 
                  The routes need to be connected to the actual database service to display real user data.
                </p>
                <div className="text-left text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  <strong>Available endpoints:</strong>
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>GET /v1/users - List users (mock)</li>
                    <li>GET /v1/users/:id - Get user (mock)</li>
                    <li>POST /v1/users - Create user (mock)</li>
                    <li>PUT /v1/users/:id - Update user (mock)</li>
                    <li>DELETE /v1/users/:id - Delete user (mock)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Users
