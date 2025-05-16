import { 
  Member, 
  Instructor, 
  User, 
  Workout, 
  WorkoutSession, 
  Reservation 
} from '../types';

const now = new Date();

// Mock administrator
export const adminUser: User = {
  id: 'admin1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@fitnes.com',
  role: 'admin',
};

// Mock instructors
export const instructors: Instructor[] = [
  {
    id: 'instructor1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@fitnes.com',
    phone: '+386 41 123 456',
    role: 'instructor',
    specialties: ['Yoga', 'Pilates'],
    classes: []
  },
  {
    id: 'instructor2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@fitnes.com',
    phone: '+386 41 234 567',
    role: 'instructor',
    specialties: ['CrossFit', 'HIIT'],
    classes: []
  },
  {
    id: 'instructor3',
    firstName: 'Ana',
    lastName: 'Novak',
    email: 'ana.novak@fitnes.com',
    phone: '+386 41 345 678',
    role: 'instructor',
    specialties: ['Spinning', 'Strength Training'],
    classes: []
  }
];

// Mock workouts
export const workouts: Workout[] = [
  {
    id: 'workout1',
    name: 'Morning Yoga',
    description: 'Start your day with energizing yoga flow for all levels.',
    capacity: 20,
    duration: 60,
    instructorId: 'instructor1',
    location: 'Studio A'
  },
  {
    id: 'workout2',
    name: 'HIIT Challenge',
    description: 'High-intensity interval training to burn calories and build strength.',
    capacity: 15,
    duration: 45,
    instructorId: 'instructor2',
    location: 'Studio B'
  },
  {
    id: 'workout3',
    name: 'Spinning Class',
    description: 'Cardio cycling workout with energizing music.',
    capacity: 12,
    duration: 50,
    instructorId: 'instructor3',
    location: 'Cycling Room'
  },
  {
    id: 'workout4',
    name: 'Strength Fundamentals',
    description: 'Learn proper form and technique for strength training exercises.',
    capacity: 10,
    duration: 60,
    instructorId: 'instructor3',
    location: 'Weight Room'
  },
  {
    id: 'workout5',
    name: 'Pilates Core',
    description: 'Strengthen your core and improve flexibility with Pilates exercises.',
    capacity: 15,
    duration: 55,
    instructorId: 'instructor1',
    location: 'Studio A'
  },
  {
    id: 'workout6',
    name: 'CrossFit WOD',
    description: 'Workout of the day with varied functional movements at high intensity.',
    capacity: 12,
    duration: 60,
    instructorId: 'instructor2',
    location: 'CrossFit Box'
  }
];

// Connect instructors to their classes
instructors.forEach(instructor => {
  instructor.classes = workouts.filter(workout => workout.instructorId === instructor.id);
});

// Generate workout sessions for the next week
const generateWorkoutSessions = (): WorkoutSession[] => {
  const sessions = [];
  const now = new Date();
  
  // Create sessions for each workout for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    
    workouts.forEach((workout, index) => {
      // Morning session at 8:00 AM
      const morningDate = new Date(date);
      morningDate.setHours(8, 0, 0, 0);
      
      // Evening session at 6:00 PM
      const eveningDate = new Date(date);
      eveningDate.setHours(18, 0, 0, 0);
      
      // Add morning session for some workouts
      if (index % 2 === 0) {
        sessions.push({
          ...workout,
          dateTime: morningDate.toISOString(),
          enrolledMembers: [],
          attendedMembers: []
        });
      }
      
      // Add evening session for all workouts
      sessions.push({
        ...workout,
        dateTime: eveningDate.toISOString(),
        enrolledMembers: [],
        attendedMembers: []
      });
    });
  }
  
  return sessions;
};

export const workoutSessions = generateWorkoutSessions();

// Mock members
export const members: Member[] = [
  {
    id: 'member1',
    firstName: 'Mark',
    lastName: 'Johnson',
    email: 'mark.johnson@example.com',
    phone: '+386 40 123 456',
    address: 'Ljubljanska cesta 10, Ljubljana',
    role: 'member',
    membershipType: 'monthly',
    membershipStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    membershipEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
    paymentStatus: 'active',
    reservations: []
  },
  {
    id: 'member2',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    phone: '+386 40 234 567',
    address: 'Mariborska ulica 5, Maribor',
    role: 'member',
    membershipType: 'annual',
    membershipStart: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
    membershipEnd: new Date(now.getFullYear() + 1, now.getMonth() - 2, 14).toISOString(),
    paymentStatus: 'active',
    reservations: []
  },
  {
    id: 'member3',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+386 40 345 678',
    address: 'Celjska cesta 20, Celje',
    role: 'member',
    membershipType: 'quarterly',
    membershipStart: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString(),
    membershipEnd: new Date(now.getFullYear(), now.getMonth() + 2, 9).toISOString(),
    paymentStatus: 'pending',
    reservations: []
  },
  {
    id: 'member4',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '+386 40 456 789',
    address: 'Koprska ulica 8, Koper',
    role: 'member',
    membershipType: 'monthly',
    membershipStart: new Date(now.getFullYear(), now.getMonth() - 1, 20).toISOString(),
    membershipEnd: new Date(now.getFullYear(), now.getMonth(), 19).toISOString(),
    paymentStatus: 'expired',
    reservations: []
  }
];

// Generate some mock reservations
export const reservations: Reservation[] = [
  {
    id: 'res1',
    memberId: 'member1',
    workoutSessionId: workoutSessions[0].id,
    status: 'confirmed',
    createdAt: new Date(now.getTime() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'res2',
    memberId: 'member1',
    workoutSessionId: workoutSessions[5].id,
    status: 'confirmed',
    createdAt: new Date(now.getTime() - 86400000 * 1).toISOString() // 1 day ago
  },
  {
    id: 'res3',
    memberId: 'member2',
    workoutSessionId: workoutSessions[2].id,
    status: 'confirmed',
    createdAt: new Date(now.getTime() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: 'res4',
    memberId: 'member3',
    workoutSessionId: workoutSessions[8].id,
    status: 'pending',
    createdAt: new Date(now.getTime() - 86400000 * 1).toISOString() // 1 day ago
  },
  {
    id: 'res5',
    memberId: 'member4',
    workoutSessionId: workoutSessions[10].id,
    status: 'cancelled',
    createdAt: new Date(now.getTime() - 86400000 * 4).toISOString() // 4 days ago
  }
];

// Add reservations to the sessions
reservations.forEach(reservation => {
  if (reservation.status !== 'cancelled') {
    const session = workoutSessions.find(s => s.id === reservation.workoutSessionId);
    if (session) {
      session.enrolledMembers.push(reservation.memberId);
    }
  }
});

// Add reservations to members
reservations.forEach(reservation => {
  const member = members.find(m => m.id === reservation.memberId);
  if (member) {
    member.reservations.push(reservation);
  }
});

// Generate random mock data for historical sessions (for analytics)
export const historicalAttendance = [
  { date: '2025-01-01', count: 45 },
  { date: '2025-01-02', count: 52 },
  { date: '2025-01-03', count: 48 },
  { date: '2025-01-04', count: 70 },
  { date: '2025-01-05', count: 61 },
  { date: '2025-01-06', count: 65 },
  { date: '2025-01-07', count: 52 },
  { date: '2025-01-08', count: 57 },
  { date: '2025-01-09', count: 60 },
  { date: '2025-01-10', count: 55 },
  { date: '2025-01-11', count: 70 },
  { date: '2025-01-12', count: 68 },
  { date: '2025-01-13', count: 53 },
  { date: '2025-01-14', count: 54 }
];

export const workoutPopularity = [
  { name: 'Morning Yoga', popularity: 85 },
  { name: 'HIIT Challenge', popularity: 92 },
  { name: 'Spinning Class', popularity: 78 },
  { name: 'Strength Fundamentals', popularity: 65 },
  { name: 'Pilates Core', popularity: 70 },
  { name: 'CrossFit WOD', popularity: 88 }
];

// Export all users for auth context
export const allUsers = [
  adminUser,
  ...instructors,
  ...members
];