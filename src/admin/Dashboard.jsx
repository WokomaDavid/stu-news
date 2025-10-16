import { Link } from 'react-router-dom';
import DashboardAnalytics from './DashboardAnalytics';
import AdminHeader from './AdminHeader';
import AuditWidget from './AuditWidget';

const Dashboard = () => (
  <div className="p-4">
    <AdminHeader title="Admin Dashboard" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DashboardAnalytics />
      <AuditWidget />
    </div>
    <ul className="space-y-2">
      <li><Link to="/admin/announcements">Manage Announcements</Link></li>
      <li><Link to="/admin/students">Manage Students</Link></li>
      <li><Link to="/admin/results">Manage Results</Link></li>
      <li><Link to="/admin/admins">Manage Admins</Link></li>
    </ul>
  </div>
);

export default Dashboard;
