/*
  # Update membership function to handle dates automatically

  1. Changes
    - Modified update_membership function to calculate end dates based on membership type
    - Added payment_status parameter
    - Improved error handling and validation
*/

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
  -- Validate input
  IF p_type NOT IN ('monthly', 'quarterly', 'annual', 'none') THEN
    RETURN json_build_object('success', false, 'message', 'Invalid membership type');
  END IF;

  IF p_payment_status NOT IN ('active', 'pending', 'expired') THEN
    RETURN json_build_object('success', false, 'message', 'Invalid payment status');
  END IF;

  -- Set start date to current timestamp
  v_start_date := CURRENT_TIMESTAMP;
  
  -- Calculate end date based on membership type
  v_end_date := CASE p_type
    WHEN 'monthly' THEN v_start_date + interval '1 month'
    WHEN 'quarterly' THEN v_start_date + interval '3 months'
    WHEN 'annual' THEN v_start_date + interval '1 year'
    ELSE v_start_date -- For 'none' type
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
    updated_at = CURRENT_TIMESTAMP;

  RETURN json_build_object(
    'success', true,
    'message', 'Membership updated successfully',
    'data', json_build_object(
      'type', p_type,
      'start_date', v_start_date,
      'end_date', v_end_date,
      'payment_status', p_payment_status
    )
  );
END;
$$;