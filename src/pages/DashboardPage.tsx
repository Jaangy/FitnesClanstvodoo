import React from 'react';
import { useAuth } from '../context/AuthContext';
import MemberDashboard from '../components/dashboard/MemberDashboard';
import InstructorDashboard from '../components/dashboard/InstructorDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'member':
        return <MemberDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl text-gray-700">No dashboard available for your role.</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;