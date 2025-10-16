import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  // hide About/Quick Links on admin pages
  const showInfo = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-soft dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6">{children}</main>
      <Footer showInfo={showInfo} />
    </div>
  );
};

export default Layout;
