
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
      console.error('Missing environment variables');
      throw new Error('Server configuration error');
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

    // Create the user with admin privileges
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

    console.log('User created successfully:', userData.user.id);

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        username,
        display_name: name,
        user_type: userType
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    // Create role record
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: userType,
        is_active: true
      });

    if (roleError) {
      console.error('Error creating role:', roleError);
      throw roleError;
    }

    // If it's an establishment, create a test establishment
    if (userType === 'establishment') {
      const { error: establishmentError } = await supabase
        .from('establishments')
        .insert({
          name: "Test Bar",
          owner_id: userData.user.id,
          address: "123 Test Street",
          latitude: 40.7128,
          longitude: -74.0060,
          cocktail_count: 0,
          phone: "555-0123",
          website: "https://testbar.com"
        });

      if (establishmentError) {
        console.error('Error creating establishment:', establishmentError);
        throw establishmentError;
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
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
