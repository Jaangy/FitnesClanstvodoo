import React, { useState, useEffect } from 'react';
import { WorkoutSession, ReservationStatus } from '../../types';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, Clock, MapPin, Search, Filter, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const WorkoutList: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [reservations, setReservations] = useState<Record<string, ReservationStatus>>({});
  
  // Get current date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Fetch workout sessions and reservations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch workout sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('workout_sessions')
          .select(`
            id,
            date_time,
            workout_id,
            workouts (
              id,
              name,
              description,
              capacity,
              duration,
              location
            ),
            reservations (
              id,
              status
            )
          `)
          .gte('date_time', currentDate.toISOString())
          .order('date_time', { ascending: true });

        if (sessionsError) throw sessionsError;

        // Transform the data
        const transformedSessions = sessionsData.map(session => ({
          id: session.id,
          dateTime: session.date_time,
          name: session.workouts.name,
          description: session.workouts.description,
          capacity: session.workouts.capacity,
          duration: session.workouts.duration,
          location: session.workouts.location,
          enrolledMembers: session.reservations.filter(r => r.status === 'confirmed').map(r => r.id)
        }));

        setWorkoutSessions(transformedSessions);

        // If user is logged in, fetch their reservations
        if (currentUser) {
          const { data: userReservations, error: reservationsError } = await supabase
            .from('reservations')
            .select('workout_session_id, status')
            .eq('user_id', currentUser.id);

          if (reservationsError) throw reservationsError;

          const reservationsMap = userReservations.reduce((acc, res) => ({
            ...acc,
            [res.workout_session_id]: res.status as ReservationStatus
          }), {});

          setReservations(reservationsMap);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [currentUser]);
  
  // Filter workout sessions
  const filteredSessions = workoutSessions
    .filter(session => {
      // Filter by search term
      if (searchTerm && !session.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !session.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by workout type
      if (filterType !== 'all' && session.name !== filterType) {
        return false;
      }
      
      return true;
    });
  
  // Get unique workout types for filter
  const workoutTypes = ['all', ...new Set(workoutSessions.map(session => session.name))];
  
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
  
  // Handle reservation
  const handleReservation = async (sessionId: string) => {
    if (!currentUser) return;
    
    setIsLoading(sessionId);
    try {
      const { data, error } = await supabase.rpc('create_reservation', {
        p_user_id: currentUser.id,
        p_session_id: sessionId
      });

      if (error) throw error;

      if (data.success) {
        // Update local state
        setReservations(prev => ({
          ...prev,
          [sessionId]: 'confirmed'
        }));

        // Update enrolled members count
        setWorkoutSessions(prev => 
          prev.map(session => 
            session.id === sessionId 
              ? { ...session, enrolledMembers: [...session.enrolledMembers, currentUser.id] }
              : session
          )
        );

        // Navigate to dashboard to show the reservation
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error making reservation:', err);
      alert('Failed to make reservation. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };
  
  // Check if user has already reserved a session
  const isSessionReserved = (session: WorkoutSession): ReservationStatus | null => {
    return reservations[session.id] || null;
  };
  
  // Check if session is full
  const isSessionFull = (session: WorkoutSession): boolean => {
    return session.enrolledMembers.length >= session.capacity;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Fitness Classes</h1>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search classes..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter by type */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {workoutTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Classes' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Classes List */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => {
            const reservationStatus = isSessionReserved(session);
            const isFull = isSessionFull(session);
            
            return (
              <Card key={session.id} className="h-full">
                <CardHeader>
                  <CardTitle>{session.name}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div className="flex items-center text-sm">
                      <User size={16} className="mr-2 text-gray-500" />
                      <span>
                        {session.enrolledMembers.length}/{session.capacity} spots filled
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    {reservationStatus ? (
                      <Badge 
                        variant={
                          reservationStatus === 'confirmed' ? 'success' : 
                          reservationStatus === 'pending' ? 'warning' : 'secondary'
                        }
                      >
                        {reservationStatus.toUpperCase()}
                      </Badge>
                    ) : (
                      isFull ? (
                        <Badge variant="secondary">FULL</Badge>
                      ) : (
                        <div></div>
                      )
                    )}
                    
                    <Button
                      variant={reservationStatus === 'confirmed' ? 'danger' : 'primary'}
                      size="sm"
                      disabled={isFull && !reservationStatus || isLoading === session.id}
                      onClick={() => handleReservation(session.id)}
                      isLoading={isLoading === session.id}
                    >
                      {reservationStatus === 'confirmed' ? 'Cancel' : 
                       reservationStatus === 'pending' ? 'Pending' : 
                       'Reserve Spot'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">No classes found matching your criteria.</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;