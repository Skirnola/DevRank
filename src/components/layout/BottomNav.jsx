import { Link, useLocation } from 'react-router-dom';
import { Home, Code2, Zap, Flame, History, User } from 'lucide-react';
import { FloatingDock } from '../ui/FloatingDock';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      title: 'Home',
      icon: Home,
      href: (props) => <Link to="/" {...props} />,
    },
    {
      title: 'Easy',
      icon: Code2,
      href: (props) => <Link to="/easy" {...props} />,
    },
    {
      title: 'Medium',
      icon: Zap,
      href: (props) => <Link to="/medium" {...props} />,
    },
    {
      title: 'Hard',
      icon: Flame,
      href: (props) => <Link to="/hard" {...props} />,
    },
    {
      title: 'History',
      icon: History,
      href: (props) => <Link to="/history" {...props} />,
    },
    {
      title: 'Profile',
      icon: User,
      href: (props) => <Link to="/profile" {...props} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 px-4">
      <FloatingDock
        items={navItems}
        desktopClassName="max-w-fit"
        mobileClassName="max-w-full"
      />
    </div>
  );
};

export default BottomNav;