import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Member, Reservation, WorkoutSession } from '../../types';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<Array<{
    reservation: Reservation;
    session: WorkoutSession;
  }>>([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!currentUser) return;

      try {
        // Fetch member's data including membership
        const { data: membershipData, error: membershipError } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (membershipError) throw membershipError;

        // Fetch upcoming reservations with workout session details
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select(`
            id,
            status,
            created_at,
            workout_sessions (
              id,
              date_time,
              workouts (
                name,
                description,
                duration,
                location
              )
            )
          `)
          .eq('user_id', currentUser.id)
          .eq('status', 'confirmed')
          .gte('workout_sessions.date_time', new Date().toISOString())
          .order('workout_sessions.date_time', { ascending: true });

        if (reservationsError) throw reservationsError;

        // Transform the data
        const transformedReservations = reservationsData
          .map(res => ({
            reservation: {
              id: res.id,
              status: res.status,
              createdAt: res.created_at,
              workoutSessionId: res.workout_sessions.id
            } as Reservation,
            session: {
              id: res.workout_sessions.id,
              dateTime: res.workout_sessions.date_time,
              name: res.workout_sessions.workouts.name,
              description: res.workout_sessions.workouts.description,
              duration: res.workout_sessions.workouts.duration,
              location: res.workout_sessions.workouts.location
            } as WorkoutSession
          }))
          .slice(0, 3); // Show only next 3 upcoming classes

        setMemberData({
          ...currentUser,
          membershipType: membershipData.type,
          membershipStart: membershipData.start_date,
          membershipEnd: membershipData.end_date,
          paymentStatus: membershipData.payment_status,
          reservations: []
        });

        setUpcomingReservations(transformedReservations);
      } catch (err) {
        console.error('Error fetching member data:', err);
      }
    };

    fetchMemberData();
  }, [currentUser]);

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

  if (!memberData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading member information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  {memberData.firstName} {memberData.lastName}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Membership Type</p>
                <p className="font-medium text-gray-900 capitalize">{memberData.membershipType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="font-medium text-gray-900">
                  {memberData.membershipEnd ? new Date(memberData.membershipEnd).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                {memberData.paymentStatus && (
                  <Badge 
                    variant={
                      memberData.paymentStatus === 'active' ? 'success' : 
                      memberData.paymentStatus === 'pending' ? 'warning' : 'danger'
                    }
                  >
                    {memberData.paymentStatus.toUpperCase()}
                  </Badge>
                )}
              </div>
              
              <Link to="/memberships">
                <Button variant="outline" fullWidth>
                  Manage Membership
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Classes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Classes</CardTitle>
              <Link to="/classes">
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
                        <h4 className="font-semibold text-gray-900">{session.name}</h4>
                        <p className="text-sm text-gray-500">{session.description}</p>
                      </div>
                      <Badge variant="default">{reservation.status}</Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formatDate(session.dateTime)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{session.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        <span>{session.location}</span>
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