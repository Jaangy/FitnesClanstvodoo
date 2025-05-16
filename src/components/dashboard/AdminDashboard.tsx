import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Dumbbell, CreditCard, ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { members, instructors, workouts, workoutPopularity, historicalAttendance } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  // Calculate some quick stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.paymentStatus === 'active').length;
  const totalInstructors = instructors.length;
  const totalWorkouts = workouts.length;
  
  // Calculate active membership percentage
  const activeMembershipPercentage = Math.round((activeMembers / totalMembers) * 100);
  
  // Get most popular workout
  const mostPopularWorkout = [...workoutPopularity].sort((a, b) => b.popularity - a.popularity)[0];
  
  // Calculate attendance trend (positive or negative) based on last 7 days vs previous 7 days
  const recentAttendance = historicalAttendance.slice(-7);
  const previousAttendance = historicalAttendance.slice(-14, -7);
  
  const recentAverage = recentAttendance.reduce((sum, day) => sum + day.count, 0) / recentAttendance.length;
  const previousAverage = previousAttendance.reduce((sum, day) => sum + day.count, 0) / previousAttendance.length;
  
  const attendanceTrend = recentAverage - previousAverage;
  const attendanceTrendPercentage = Math.round((attendanceTrend / previousAverage) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`flex items-center ${activeMembershipPercentage >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                <span className="font-medium">{activeMembershipPercentage}%</span>
                <span className="ml-1">active memberships</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <Dumbbell className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="text-gray-600">
                <span className="font-medium">{Math.round(totalWorkouts / totalInstructors)}</span>
                <span className="ml-1">classes per instructor</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Workout Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totalWorkouts}</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="text-gray-600">
                <span className="font-medium">{mostPopularWorkout.name}</span>
                <span className="ml-1">most popular</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Attendance Trend</p>
                <p className="text-2xl font-bold text-gray-900">{recentAverage.toFixed(0)}</p>
              </div>
              <div className={`${attendanceTrend >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg p-3`}>
                {attendanceTrend >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`flex items-center ${attendanceTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-medium">{attendanceTrend >= 0 ? '+' : ''}{attendanceTrendPercentage}%</span>
                <span className="ml-1">last 7 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Membership Status</CardTitle>
              <Link to="/members">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <span className="mr-1">View All</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Active</span>
                  <span className="text-sm font-medium text-gray-900">{activeMembers} / {totalMembers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${activeMembershipPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Pending</span>
                  <span className="text-sm font-medium text-gray-900">
                    {members.filter(m => m.paymentStatus === 'pending').length} / {totalMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((members.filter(m => m.paymentStatus === 'pending').length / totalMembers) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Expired</span>
                  <span className="text-sm font-medium text-gray-900">
                    {members.filter(m => m.paymentStatus === 'expired').length} / {totalMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((members.filter(m => m.paymentStatus === 'expired').length / totalMembers) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Membership Types</h4>
              
              {/* Count members by membership type */}
              {(['monthly', 'quarterly', 'annual', 'none'] as const).map(type => {
                const count = members.filter(m => m.membershipType === type).length;
                const percentage = Math.round((count / totalMembers) * 100);
                
                return (
                  <div key={type} className="flex items-center">
                    <div className="w-1/3 text-sm capitalize">{type}</div>
                    <div className="w-1/3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/3 text-right text-sm">{count} ({percentage}%)</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Class Popularity</CardTitle>
                <CardDescription>Most attended classes in the last 30 days</CardDescription>
              </div>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <span className="mr-1">Full Report</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutPopularity.sort((a, b) => b.popularity - a.popularity).map(workout => (
                <div key={workout.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{workout.name}</span>
                    <span>{workout.popularity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        workout.popularity > 85 ? 'bg-green-500' : 
                        workout.popularity > 70 ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${workout.popularity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/members" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-1" />
                  <span>Manage Members</span>
                </Button>
              </Link>
              
              <Link to="/classes" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <Dumbbell className="h-6 w-6 mb-1" />
                  <span>Manage Classes</span>
                </Button>
              </Link>
              
              <Link to="/payments" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span>Payment Reports</span>
                </Button>
              </Link>
              
              <Link to="/analytics" className="w-full">
                <Button variant="outline" fullWidth className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-1" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;