/*
  # Add test workout sessions and instructors

  1. New Data
    - Add test instructors
    - Add test workouts
    - Add test workout sessions
    
  2. Changes
    - Add test data for demonstration purposes
*/

-- Add test instructors
INSERT INTO users (id, first_name, last_name, email, phone, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Jane', 'Smith', 'jane.smith@fitnes.com', '+386 41 123 456', 'instructor'),
  ('22222222-2222-2222-2222-222222222222', 'John', 'Doe', 'john.doe@fitnes.com', '+386 41 234 567', 'instructor')
ON CONFLICT (email) DO NOTHING;

-- Add test workouts
INSERT INTO workouts (id, name, description, capacity, duration, instructor_id, location)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Morning Yoga', 'Start your day with energizing yoga flow', 15, 60, '11111111-1111-1111-1111-111111111111', 'Studio A'),
  ('44444444-4444-4444-4444-444444444444', 'HIIT Workout', 'High-intensity interval training', 12, 45, '22222222-2222-2222-2222-222222222222', 'Studio B'),
  ('55555555-5555-5555-5555-555555555555', 'Strength Training', 'Build muscle and improve strength', 10, 50, '11111111-1111-1111-1111-111111111111', 'Weight Room'),
  ('66666666-6666-6666-6666-666666666666', 'Spinning', 'Cardio cycling workout', 20, 45, '22222222-2222-2222-2222-222222222222', 'Cycling Studio')
ON CONFLICT DO NOTHING;

-- Add workout sessions for the next 7 days
WITH dates AS (
  SELECT generate_series(
    date_trunc('day', now()),
    date_trunc('day', now() + interval '7 days'),
    interval '1 day'
  ) AS date
)
INSERT INTO workout_sessions (workout_id, date_time)
SELECT 
  w.id,
  (d.date + time '08:00' + (CASE WHEN random() > 0.5 THEN interval '0 hours' ELSE interval '10 hours' END))::timestamptz
FROM dates d
CROSS JOIN workouts w
WHERE NOT EXISTS (
  SELECT 1 
  FROM workout_sessions ws 
  WHERE ws.workout_id = w.id 
  AND ws.date_time = (d.date + time '08:00')::timestamptz
);