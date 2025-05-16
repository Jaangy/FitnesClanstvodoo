import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Instructor } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, Clock, Users, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workoutSessions } from '../../data/mockData';

const InstructorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const instructor = currentUser as Instructor;

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter workout sessions for this instructor and upcoming
  const instructorSessions = workoutSessions
    .filter(session => session.instructorId === instructor.id && new Date(session.dateTime) >= today)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5); // Show only next 5 sessions

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

  // Get class time status
  const getSessionStatus = (dateTime: string) => {
    const sessionDate = new Date(dateTime);
    const now = new Date();
    
    // If the session is today
    if (
      sessionDate.getDate() === now.getDate() &&
      sessionDate.getMonth() === now.getMonth() &&
      sessionDate.getFullYear() === now.getFullYear()
    ) {
      return 'today';
    }
    
    // If the session is tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (
      sessionDate.getDate() === tomorrow.getDate() &&
      sessionDate.getMonth() === tomorrow.getMonth() &&
      sessionDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'tomorrow';
    }
    
    // Otherwise, it's in the future
    return 'upcoming';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Instructor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Instructor Profile Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Instructor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-lg text-gray-900">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-gray-500">{instructor.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Classes</p>
                <div className="font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{instructor.classes.length} class types</span>
                </div>
              </div>
              
              <Button variant="outline" fullWidth>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Classes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Classes</CardTitle>
              <Link to="/my-classes">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {instructorSessions.length > 0 ? (
              <div className="space-y-4">
                {instructorSessions.map(session => {
                  const status = getSessionStatus(session.dateTime);
                  const statusBadge = status === 'today' 
                    ? <Badge variant="danger">Today</Badge> 
                    : status === 'tomorrow' 
                      ? <Badge variant="warning">Tomorrow</Badge> 
                      : <Badge variant="secondary">Upcoming</Badge>;
                  
                  return (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{session.name}</h4>
                          <p className="text-sm text-gray-500">{session.description}</p>
                        </div>
                        {statusBadge}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center text-sm">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          <span>{formatDate(session.dateTime)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin size={16} className="mr-2 text-gray-500" />
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users size={16} className="mr-2 text-gray-500" />
                          <span>{session.enrolledMembers.length}/{session.capacity} enrolled</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        {status === 'today' ? (
                          <Button variant="primary" size="sm" icon={<CheckCircle size={16} />}>
                            Start Class
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any upcoming classes.</p>
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
              <Link to="/attendance" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <CheckCircle className="h-6 w-6 mb-1" />
                  <span>Take Attendance</span>
                </Button>
              </Link>
              
              <Link to="/my-classes" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-1" />
                  <span>View Schedule</span>
                </Button>
              </Link>
              
              <Link to="/profile" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-1" />
                  <span>My Profile</span>
                </Button>
              </Link>
              
              <Link to="/reports" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Clock className="h-6 w-6 mb-1" />
                  <span>Class Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;