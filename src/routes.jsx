import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import AnnouncementDetail from './pages/AnnouncementDetail';
import Results from './pages/Results';
import Archive from './pages/Archive';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './admin/Dashboard';
import ManageAnnouncements from './admin/ManageAnnouncements';
import ManageStudents from './admin/ManageStudents';
import ManageResults from './admin/ManageResults';
import ManageAdmins from './admin/ManageAdmins';
import Layout from './components/Layout';


const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
  <Route path="/events" element={<Layout><Events /></Layout>} />
  <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
  <Route path="/announcements/:id" element={<Layout><AnnouncementDetail /></Layout>} />
      <Route path="/results" element={<Layout><Results /></Layout>} />
      <Route path="/archive" element={<Layout><Archive /></Layout>} />
      <Route path="/admin" element={<Layout><AdminLogin /></Layout>} />
      <Route path="/admin/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/admin/announcements" element={<Layout><ManageAnnouncements /></Layout>} />
      <Route path="/admin/students" element={<Layout><ManageStudents /></Layout>} />
      <Route path="/admin/results" element={<Layout><ManageResults /></Layout>} />
      <Route path="/admin/admins" element={<Layout><ManageAdmins /></Layout>} />
    </Routes>
  </Router>
);

export default AppRoutes;
