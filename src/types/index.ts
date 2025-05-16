// Type definitions for the Fitness App

export type UserRole = 'member' | 'instructor' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
}

export interface Member extends User {
  membershipType: MembershipType;
  membershipStart: string; // ISO date string
  membershipEnd: string; // ISO date string
  paymentStatus: PaymentStatus;
  reservations: Reservation[];
}

export interface Instructor extends User {
  specialties: string[];
  classes: Workout[];
}

export type MembershipType = 'monthly' | 'quarterly' | 'annual' | 'none';
export type PaymentStatus = 'active' | 'pending' | 'expired';

export interface Workout {
  id: string;
  name: string;
  description: string;
  capacity: number;
  duration: number; // in minutes
  instructorId: string;
  location: string;
}

export interface WorkoutSession extends Workout {
  dateTime: string; // ISO date string
  enrolledMembers: string[]; // member IDs
  attendedMembers: string[]; // member IDs of those who attended
}

export interface Reservation {
  id: string;
  memberId: string;
  workoutSessionId: string;
  status: ReservationStatus;
  createdAt: string; // ISO date string
}

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  date: string; // ISO date string
}

export type PaymentType = 'membership' | 'single-class';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO date string
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';