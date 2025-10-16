import { Link, useLocation } from 'react-router-dom';

const AdminHeader = ({ title, hideLink }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin/dashboard';
  const showLink = !hideLink && !isDashboard;

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
      </div>
      <div>
        {showLink && (
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            ← Back to dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
