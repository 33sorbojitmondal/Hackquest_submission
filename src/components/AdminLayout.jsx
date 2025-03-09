import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

/**
 * Admin layout component for the admin dashboard
 * Includes the admin navbar, sidebar, and main content area
 */
const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-grow">
        <AdminSidebar />
        <main className="flex-grow p-6 bg-gray-100">
          <div className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 