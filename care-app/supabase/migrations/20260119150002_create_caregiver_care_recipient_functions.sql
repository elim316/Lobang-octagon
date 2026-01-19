set check_function_bodies = off;

-- Caregiver signup function
CREATE OR REPLACE FUNCTION public.caregiver_signup(p_event_id bigint)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_event_exists BOOLEAN;
  v_existing_status TEXT;
  v_signup_count INTEGER;
  v_needed INTEGER;
  v_is_full BOOLEAN;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Verify event exists
  SELECT EXISTS(SELECT 1 FROM "Events" WHERE id = p_event_id)
  INTO v_event_exists;
  
  IF NOT v_event_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Event does not exist'
    );
  END IF;
  
  -- Check if record exists and get its status
  SELECT status
  INTO v_existing_status
  FROM event_caregivers 
  WHERE event_id = p_event_id 
    AND caregiver_user_id = v_user_id;
  
  -- If already signed up (not cancelled), return error
  IF v_existing_status = 'signed_up' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Already signed up for this event'
    );
  END IF;
  
  -- Check if event is full (only count active signups)
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(e."No. of people", 0)
  INTO v_signup_count, v_needed
  FROM "Events" e
  LEFT JOIN event_caregivers ec ON e.id = ec.event_id AND ec.status = 'signed_up'
  WHERE e.id = p_event_id
  GROUP BY e."No. of people";
  
  v_is_full := v_needed > 0 AND v_signup_count >= v_needed;
  
  IF v_is_full THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Event is full'
    );
  END IF;
  
  -- If record exists with cancelled status, update it to signed_up
  IF v_existing_status = 'cancelled' THEN
    UPDATE event_caregivers
    SET status = 'signed_up'
    WHERE event_id = p_event_id
      AND caregiver_user_id = v_user_id;
  ELSE
    -- Otherwise, insert new signup
    INSERT INTO event_caregivers (event_id, caregiver_user_id, status)
    VALUES (p_event_id, v_user_id, 'signed_up');
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully signed up for event'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$
;

-- Caregiver unsignup function
CREATE OR REPLACE FUNCTION public.caregiver_unsignup(p_event_id bigint)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_current_status TEXT;
  v_updated_count INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Check if signup exists and get its status
  SELECT status
  INTO v_current_status
  FROM event_caregivers 
  WHERE event_id = p_event_id 
    AND caregiver_user_id = v_user_id;
  
  IF v_current_status IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You are not signed up for this event'
    );
  END IF;
  
  -- If already cancelled, return error
  IF v_current_status = 'cancelled' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Signup is already cancelled'
    );
  END IF;
  
  -- Update status to cancelled instead of deleting
  UPDATE event_caregivers
  SET status = 'cancelled'
  WHERE event_id = p_event_id
    AND caregiver_user_id = v_user_id;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  IF v_updated_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to cancel signup. The record may be protected by database policies.'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully cancelled signup'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$
;

-- Care recipient signup function
CREATE OR REPLACE FUNCTION public.care_recipient_signup(p_event_id bigint)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_event_exists BOOLEAN;
  v_existing_status TEXT;
  v_signup_count INTEGER;
  v_needed INTEGER;
  v_is_full BOOLEAN;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Verify event exists
  SELECT EXISTS(SELECT 1 FROM "Events" WHERE id = p_event_id)
  INTO v_event_exists;
  
  IF NOT v_event_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Event does not exist'
    );
  END IF;
  
  -- Check if record exists and get its status
  SELECT status
  INTO v_existing_status
  FROM event_care_recipients 
  WHERE event_id = p_event_id 
    AND care_recipient_user_id = v_user_id;
  
  -- If already signed up (not cancelled), return error
  IF v_existing_status = 'signed_up' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Already signed up for this event'
    );
  END IF;
  
  -- Check if event is full (only count active signups)
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(e."No. of people", 0)
  INTO v_signup_count, v_needed
  FROM "Events" e
  LEFT JOIN event_care_recipients ecr ON e.id = ecr.event_id AND ecr.status = 'signed_up'
  WHERE e.id = p_event_id
  GROUP BY e."No. of people";
  
  v_is_full := v_needed > 0 AND v_signup_count >= v_needed;
  
  IF v_is_full THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Event is full'
    );
  END IF;
  
  -- If record exists with cancelled status, update it to signed_up
  IF v_existing_status = 'cancelled' THEN
    UPDATE event_care_recipients
    SET status = 'signed_up'
    WHERE event_id = p_event_id
      AND care_recipient_user_id = v_user_id;
  ELSE
    -- Otherwise, insert new signup
    INSERT INTO event_care_recipients (event_id, care_recipient_user_id, status)
    VALUES (p_event_id, v_user_id, 'signed_up');
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully signed up for event'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$
;

-- Care recipient unsignup function
CREATE OR REPLACE FUNCTION public.care_recipient_unsignup(p_event_id bigint)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_current_status TEXT;
  v_updated_count INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Check if signup exists and get its status
  SELECT status
  INTO v_current_status
  FROM event_care_recipients 
  WHERE event_id = p_event_id 
    AND care_recipient_user_id = v_user_id;
  
  IF v_current_status IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You are not signed up for this event'
    );
  END IF;
  
  -- If already cancelled, return error
  IF v_current_status = 'cancelled' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Signup is already cancelled'
    );
  END IF;
  
  -- Update status to cancelled instead of deleting
  UPDATE event_care_recipients
  SET status = 'cancelled'
  WHERE event_id = p_event_id
    AND care_recipient_user_id = v_user_id;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  IF v_updated_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to cancel signup. The record may be protected by database policies.'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully cancelled signup'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$
;

-- Get events for month (caregiver)
CREATE OR REPLACE FUNCTION public.get_events_for_month_caregiver(month_slug text, user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  start_date TIMESTAMP WITHOUT TIME ZONE;
  end_date TIMESTAMP WITHOUT TIME ZONE;
  year_val INTEGER;
  month_val INTEGER;
  result JSON;
BEGIN
  -- Parse month_slug (YYYY-MM format)
  year_val := CAST(SPLIT_PART(month_slug, '-', 1) AS INTEGER);
  month_val := CAST(SPLIT_PART(month_slug, '-', 2) AS INTEGER);
  
  -- Calculate UTC date range for the month
  start_date := MAKE_TIMESTAMP(year_val, month_val, 1, 0, 0, 0);
  end_date := MAKE_TIMESTAMP(
    CASE WHEN month_val = 12 THEN year_val + 1 ELSE year_val END,
    CASE WHEN month_val = 12 THEN 1 ELSE month_val + 1 END,
    1, 0, 0, 0
  );
  
  -- Query events with signup counts and user status
  WITH event_data AS (
    SELECT 
      e.id,
      e."Name",
      e."Event Type",
      e."No. of people",
      e."Date and Time",
      e."Duration",
      COALESCE(signup_counts.count, 0) as signup_count,
      COALESCE(user_signups.exists, false) as is_signed_up
    FROM "Events" e
    LEFT JOIN (
      SELECT 
        event_id,
        COUNT(*)::INTEGER as count
      FROM event_caregivers
      WHERE status = 'signed_up'
      GROUP BY event_id
    ) signup_counts ON e.id = signup_counts.event_id
    LEFT JOIN (
      SELECT 
        event_id,
        true as exists
      FROM event_caregivers
      WHERE caregiver_user_id = user_id
        AND status = 'signed_up'
    ) user_signups ON e.id = user_signups.event_id
    WHERE e."Date and Time" >= start_date
      AND e."Date and Time" < end_date
    ORDER BY e."Date and Time" ASC
  )
  SELECT json_agg(
    json_build_object(
      'id', id,
      'Name', "Name",
      'Event Type', "Event Type",
      'No. of people', "No. of people",
      'Date and Time', "Date and Time",
      'Duration', "Duration",
      'signup_count', signup_count,
      'is_signed_up', is_signed_up,
      'is_full', COALESCE(
        "No. of people" > 0 AND signup_count >= "No. of people",
        false
      )
    )
  )
  INTO result
  FROM event_data;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$function$
;

-- Get events for month (care recipient)
CREATE OR REPLACE FUNCTION public.get_events_for_month_care_recipient(month_slug text, user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  start_date TIMESTAMP WITHOUT TIME ZONE;
  end_date TIMESTAMP WITHOUT TIME ZONE;
  year_val INTEGER;
  month_val INTEGER;
  result JSON;
BEGIN
  -- Parse month_slug (YYYY-MM format)
  year_val := CAST(SPLIT_PART(month_slug, '-', 1) AS INTEGER);
  month_val := CAST(SPLIT_PART(month_slug, '-', 2) AS INTEGER);
  
  -- Calculate UTC date range for the month
  start_date := MAKE_TIMESTAMP(year_val, month_val, 1, 0, 0, 0);
  end_date := MAKE_TIMESTAMP(
    CASE WHEN month_val = 12 THEN year_val + 1 ELSE year_val END,
    CASE WHEN month_val = 12 THEN 1 ELSE month_val + 1 END,
    1, 0, 0, 0
  );
  
  -- Query events with signup counts and user status
  WITH event_data AS (
    SELECT 
      e.id,
      e."Name",
      e."Event Type",
      e."No. of people",
      e."Date and Time",
      e."Duration",
      COALESCE(signup_counts.count, 0) as signup_count,
      COALESCE(user_signups.exists, false) as is_signed_up
    FROM "Events" e
    LEFT JOIN (
      SELECT 
        event_id,
        COUNT(*)::INTEGER as count
      FROM event_care_recipients
      WHERE status = 'signed_up'
      GROUP BY event_id
    ) signup_counts ON e.id = signup_counts.event_id
    LEFT JOIN (
      SELECT 
        event_id,
        true as exists
      FROM event_care_recipients
      WHERE care_recipient_user_id = user_id
        AND status = 'signed_up'
    ) user_signups ON e.id = user_signups.event_id
    WHERE e."Date and Time" >= start_date
      AND e."Date and Time" < end_date
    ORDER BY e."Date and Time" ASC
  )
  SELECT json_agg(
    json_build_object(
      'id', id,
      'Name', "Name",
      'Event Type', "Event Type",
      'No. of people', "No. of people",
      'Date and Time', "Date and Time",
      'Duration', "Duration",
      'signup_count', signup_count,
      'is_signed_up', is_signed_up,
      'is_full', COALESCE(
        "No. of people" > 0 AND signup_count >= "No. of people",
        false
      )
    )
  )
  INTO result
  FROM event_data;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$function$
;
