/*
  # Fix user registration policies

  1. Changes
    - Add RLS policy for user registration
    - Add policy for users to update their own data
  
  2. Security
    - Enable RLS on users table (if not already enabled)
    - Add policy for new user registration
    - Add policy for users to update their own data
*/

-- Enable RLS on users table (idempotent)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for new user registration
CREATE POLICY "Users can insert their own data" 
ON users 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update their own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);