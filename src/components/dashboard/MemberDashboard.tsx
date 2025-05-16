import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Member, Reservation, WorkoutSession } from '../../types';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workoutSessions } from '../../data/mockData';

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const member = currentUser as Member;

  // Get upcoming reservations (filter confirmed reservations and sort by date)
  const upcomingReservations = member.reservations
    .filter(res => res.status === 'confirmed')
    .map(res => {
      const session = workoutSessions.find(s => s.id === res.workoutSessionId);
      return { reservation: res, session };
    })
    .filter(item => item.session && new Date(item.session.dateTime) > new Date())
    .sort((a, b) => {
      return new Date(a.session!.dateTime).getTime() - new Date(b.session!.dateTime).getTime();
    })
    .slice(0, 3); // Show only the next 3 upcoming classes

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Get membership status class based on payment status
  const getMembershipStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Member Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Membership Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Membership Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">
                  {member.firstName} {member.lastName}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Membership Type</p>
                <p className="font-medium text-gray-900 capitalize">{member.membershipType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="font-medium text-gray-900">
                  {new Date(member.membershipEnd).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge 
                  variant={
                    member.paymentStatus === 'active' ? 'success' : 
                    member.paymentStatus === 'pending' ? 'warning' : 'danger'
                  }
                >
                  {member.paymentStatus.toUpperCase()}
                </Badge>
              </div>
              
              <Button variant="outline" fullWidth>
                Renew Membership
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Classes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Classes</CardTitle>
              <Link to="/reservations">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map(({ reservation, session }) => (
                  <div
                    key={reservation.id}
                    className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{session?.name}</h4>
                        <p className="text-sm text-gray-500">{session?.description}</p>
                      </div>
                      <Badge variant="default">{reservation.status}</Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formatDate(session?.dateTime || '')}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{session?.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        <span>{session?.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm">
                        Check In
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any upcoming classes.</p>
                <Link to="/classes">
                  <Button variant="primary">Browse Classes</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/classes" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-1" />
                  <span>Book a Class</span>
                </Button>
              </Link>
              
              <Link to="/profile" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-1" />
                  <span>My Profile</span>
                </Button>
              </Link>
              
              <Link to="/reservations" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Clock className="h-6 w-6 mb-1" />
                  <span>My Schedule</span>
                </Button>
              </Link>
              
              <Link to="/memberships" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <MapPin className="h-6 w-6 mb-1" />
                  <span>Membership Plans</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;