import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="flex h-screen dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
