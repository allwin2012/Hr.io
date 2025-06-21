import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout = ({ children, onLogout }: LayoutProps) => {
  return (
    <div className="flex h-screen dark:bg-gray-900 bg-gray-50">
      <Sidebar collapsed={true} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
         onLogout={onLogout}
         toggleSidebar={() => {}}
         toggleTheme={() => {}}
         darkMode={false}
         />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
