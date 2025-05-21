import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WorkoutSession, ReservationStatus } from '../types';

const ReservationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Array<{
    id: string;
    status: ReservationStatus;
    session: WorkoutSession;
  }>>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            id,
            status,
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
          .order('workout_sessions(date_time)', { ascending: true });

        if (error) throw error;

        // Transform the data
        const transformedReservations = data.map(res => ({
          id: res.id,
          status: res.status as ReservationStatus,
          session: {
            id: res.workout_sessions.id,
            dateTime: res.workout_sessions.date_time,
            name: res.workout_sessions.workouts.name,
            description: res.workout_sessions.workouts.description,
            duration: res.workout_sessions.workouts.duration,
            location: res.workout_sessions.workouts.location
          } as WorkoutSession
        }));

        setReservations(transformedReservations);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        alert('Failed to load reservations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [currentUser]);

  const handleCancellation = async (reservationId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      // Update local state
      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Failed to cancel reservation');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reservations</h1>

      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(({ id, status, session }) => (
            <Card key={id} className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{session.name}</CardTitle>
                  <Badge 
                    variant={
                      status === 'confirmed' ? 'success' : 
                      status === 'pending' ? 'warning' : 'secondary'
                    }
                  >
                    {status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{session.description}</p>
                
                <div className="space-y-2">
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

                <div className="pt-4">
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => handleCancellation(id)}
                    icon={<X size={16} />}
                  >
                    Cancel Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any reservations.</p>
            <Button variant="primary" onClick={() => window.location.href = '/classes'}>
              Browse Classes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReservationsPage;