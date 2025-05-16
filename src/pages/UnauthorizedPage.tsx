import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button variant="primary" fullWidth>
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" fullWidth>
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;