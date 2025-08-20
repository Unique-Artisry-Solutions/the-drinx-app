-- Update switch_active_role function to automatically create missing roles
CREATE OR REPLACE FUNCTION public.switch_active_role(role_to_activate user_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Check if the user has the role they're trying to activate
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = role_to_activate
    ) THEN
        -- Create the role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (auth.uid(), role_to_activate, false);
    END IF;

    -- First deactivate all roles for the user
    UPDATE public.user_roles 
    SET is_active = false 
    WHERE user_id = auth.uid();
    
    -- Then activate the specified role
    UPDATE public.user_roles 
    SET is_active = true 
    WHERE user_id = auth.uid() 
    AND role = role_to_activate;

    -- Verify the role was activated
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = role_to_activate 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Failed to activate role';
    END IF;
END;
$function$;