// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Cursor from './components/ui/Cursor';
import Ticker from './components/ui/Ticker';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages (To be implemented)
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages (To be implemented)
import AdminDashboard from './pages/admin/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageMembers from './pages/admin/ManageMembers';

const App = () => {
  return (
    <AuthProvider>
      <Cursor />
      <Ticker />
      <Router>
        <div className="flex flex-col min-h-screen bg-void text-text-0 pt-8">
          {/* Cyberpunk Scanline Overlay */}
          <div className="noise-overlay" />
          <div className="fixed inset-0 pointer-events-none z-[1]">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-glow/10 animate-scanline shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          </div>
          
          {/* 3D Floor Grid */}
          <div className="perspective-floor fixed bottom-0 w-full rounded-t-full opacity-40 blur-[1px]" />
          
          {/* Horizon fade to black */}
          <div className="fixed bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-background/0 to-background pointer-events-none z-[-1]" />


          <Navbar />
          
          <main className="flex-grow pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/members" element={<Members />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/events" element={<ManageEvents />} />
                <Route path="/admin/announcements" element={<ManageAnnouncements />} />
                <Route path="/admin/members" element={<ManageMembers />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
