import { Outlet } from 'react-router-dom';
import { ResizableNavbar } from './ResizableNavbar';
import NotificationBanner from '../NotificationBanner';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Sticky Container - Banner + Navbar stick together */}
      <div className="sticky top-0 z-50">
        {/* Banner */}
        {!isAuthenticated && <NotificationBanner />}
        
        {/* Navbar */}
        <ResizableNavbar />
      </div>
      
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;