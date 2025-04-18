
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceKey 
      });
      throw new Error('Server configuration error: Missing environment variables');
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, password, name, username, userType } = await req.json();
    console.log('Creating test user with details:', { email, name, username, userType });

    // First check if the user already exists
    const { data: existingUser, error: lookupError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (lookupError) {
      console.log('Error looking up existing user:', lookupError);
      // Only proceed if it's not a user already exists error
      if (lookupError.message?.includes('User not found')) {
        // Continue with creation
        console.log('User does not exist, proceeding with creation');
      } else {
        throw lookupError;
      }
    }
    
    // If user already exists, return early with success
    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      return new Response(JSON.stringify({
        user: existingUser,
        message: 'User already exists'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Create the user with admin privileges
    console.log('Creating user in auth system...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        username,
        user_type: userType
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      throw userError;
    }

    const userId = userData.user.id;
    console.log('User created successfully:', userId);

    // Create profile record
    try {
      console.log('Creating profile record...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username,
          display_name: name,
          user_type: userType
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue execution even if profile creation fails
      }
    } catch (profileError) {
      console.error('Exception creating profile:', profileError);
      // Continue execution
    }

    // Create role record
    try {
      console.log('Creating role record...');
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: userType,
          is_active: true
        });

      if (roleError) {
        console.error('Error creating role:', roleError);
        // Continue execution
      }
    } catch (roleError) {
      console.error('Exception creating role:', roleError);
      // Continue execution
    }

    // If it's an establishment, create a test establishment
    if (userType === 'establishment') {
      try {
        console.log('Creating establishment record...');
        const { error: establishmentError } = await supabase
          .from('establishments')
          .insert({
            name: "Test Bar",
            owner_id: userId,
            address: "123 Test Street",
            latitude: 40.7128,
            longitude: -74.0060,
            cocktail_count: 0,
            phone: "555-0123",
            website: "https://testbar.com"
          });

        if (establishmentError) {
          console.error('Error creating establishment:', establishmentError);
          // Continue execution
        }
      } catch (establishmentError) {
        console.error('Exception creating establishment:', establishmentError);
        // Continue execution
      }
    }

    return new Response(JSON.stringify({
      user: userData.user,
      message: 'Test user created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create_test_user function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Unknown error occurred',
      code: error.code || 'unknown_error',
      status: error.status || 500
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
