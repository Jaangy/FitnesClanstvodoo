import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Dumbbell, Calendar, Users, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const getNavLinks = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
          { to: '/members', label: 'Members', icon: <Users size={18} /> },
          { to: '/classes', label: 'Classes', icon: <Dumbbell size={18} /> },
        ];
      case 'instructor':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
          { to: '/my-classes', label: 'My Classes', icon: <Dumbbell size={18} /> },
          { to: '/attendance', label: 'Attendance', icon: <Users size={18} /> },
        ];
      case 'member':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
          { to: '/classes', label: 'Classes', icon: <Dumbbell size={18} /> },
          { to: '/reservations', label: 'My Reservations', icon: <Calendar size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = isAuthenticated ? getNavLinks(currentUser?.role) : [];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Fitnes d.o.o.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated && (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2 px-2 py-2"
                      onClick={closeMobileMenu}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2 px-2 py-2"
                    onClick={closeMobileMenu}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="mt-2"
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="primary" size="sm" fullWidth>
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;