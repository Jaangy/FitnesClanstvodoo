/*
  # Implement Reservation System

  1. New Functions
    - create_reservation: Handles creating new reservations with capacity checks
    - update_membership: Handles membership plan updates
  
  2. Security
    - Functions run with SECURITY DEFINER to bypass RLS
    - Input validation for reservation creation
*/

-- Function to create a reservation with capacity check
CREATE OR REPLACE FUNCTION create_reservation(
  p_user_id uuid,
  p_session_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_capacity integer;
  v_current_count integer;
  v_session_exists boolean;
BEGIN
  -- Check if session exists and get capacity
  SELECT EXISTS (
    SELECT 1 FROM workout_sessions WHERE id = p_session_id
  ), w.capacity
  INTO v_session_exists, v_capacity
  FROM workout_sessions ws
  JOIN workouts w ON w.id = ws.workout_id
  WHERE ws.id = p_session_id;

  IF NOT v_session_exists THEN
    RETURN json_build_object('success', false, 'message', 'Session not found');
  END IF;

  -- Count current reservations
  SELECT COUNT(*)
  INTO v_current_count
  FROM reservations
  WHERE workout_session_id = p_session_id
  AND status = 'confirmed';

  -- Check capacity
  IF v_current_count >= v_capacity THEN
    RETURN json_build_object('success', false, 'message', 'Class is full');
  END IF;

  -- Create reservation
  INSERT INTO reservations (
    user_id,
    workout_session_id,
    status,
    created_at
  ) VALUES (
    p_user_id,
    p_session_id,
    'confirmed',
    now()
  );

  RETURN json_build_object('success', true, 'message', 'Reservation created successfully');
END;
$$;

-- Function to update membership
CREATE OR REPLACE FUNCTION update_membership(
  p_user_id uuid,
  p_type text,
  p_payment_status text DEFAULT 'pending'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start_date timestamptz;
  v_end_date timestamptz;
BEGIN
  -- Set dates based on membership type
  v_start_date := now();
  
  v_end_date := CASE p_type
    WHEN 'monthly' THEN v_start_date + interval '1 month'
    WHEN 'quarterly' THEN v_start_date + interval '3 months'
    WHEN 'annual' THEN v_start_date + interval '1 year'
    ELSE v_start_date
  END;

  -- Update or insert membership
  INSERT INTO memberships (
    user_id,
    type,
    start_date,
    end_date,
    payment_status
  ) VALUES (
    p_user_id,
    p_type,
    v_start_date,
    v_end_date,
    p_payment_status
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    type = EXCLUDED.type,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    payment_status = EXCLUDED.payment_status,
    updated_at = now();

  RETURN json_build_object('success', true, 'message', 'Membership updated successfully');
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_reservation TO authenticated;
GRANT EXECUTE ON FUNCTION update_membership TO authenticated;

-- Add unique constraint on user_id for memberships
ALTER TABLE memberships ADD CONSTRAINT memberships_user_id_key UNIQUE (user_id);