/*
  # Create function for initial membership creation

  1. New Function
    - `create_initial_membership`: Creates initial membership for new users
      - Parameters:
        - user_id (uuid)
        - membership_type (text)
        - start_date (timestamptz)
        - end_date (timestamptz)
        - status (text)

  2. Security
    - Function is executed with security definer
    - Only authenticated users can call this function
*/

CREATE OR REPLACE FUNCTION create_initial_membership(
  user_id uuid,
  membership_type text,
  start_date timestamptz,
  end_date timestamptz,
  status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO memberships (
    user_id,
    type,
    start_date,
    end_date,
    payment_status
  ) VALUES (
    user_id,
    membership_type,
    start_date,
    end_date,
    status
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_initial_membership TO authenticated;