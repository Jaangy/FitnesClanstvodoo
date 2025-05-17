/*
  # Initial Schema Setup for Fitness Application

  1. New Tables
    - users
      - id (uuid, primary key)
      - first_name (text)
      - last_name (text)
      - email (text, unique)
      - phone (text, nullable)
      - address (text, nullable)
      - role (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - memberships
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - type (text)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - payment_status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - workouts
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - capacity (integer)
      - duration (integer)
      - instructor_id (uuid, references users)
      - location (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - workout_sessions
      - id (uuid, primary key)
      - workout_id (uuid, references workouts)
      - date_time (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - reservations
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - workout_session_id (uuid, references workout_sessions)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  role text NOT NULL CHECK (role IN ('member', 'instructor', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memberships table
CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('monthly', 'quarterly', 'annual', 'none')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  payment_status text NOT NULL CHECK (payment_status IN ('active', 'pending', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  duration integer NOT NULL CHECK (duration > 0),
  instructor_id uuid REFERENCES users ON DELETE SET NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workout_sessions table
CREATE TABLE workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts ON DELETE CASCADE,
  date_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  workout_session_id uuid REFERENCES workout_sessions ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Instructors and admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('instructor', 'admin'));

-- Create policies for memberships table
CREATE POLICY "Users can view their own memberships"
  ON memberships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all memberships"
  ON memberships
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for workouts table
CREATE POLICY "Anyone can view workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can manage their workouts"
  ON workouts
  TO authenticated
  USING (auth.uid() = instructor_id OR auth.jwt() ->> 'role' = 'admin');

-- Create policies for workout_sessions table
CREATE POLICY "Anyone can view workout sessions"
  ON workout_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can manage their workout sessions"
  ON workout_sessions
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workouts w
    WHERE w.id = workout_sessions.workout_id
    AND (w.instructor_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  ));

-- Create policies for reservations table
CREATE POLICY "Users can view their own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();