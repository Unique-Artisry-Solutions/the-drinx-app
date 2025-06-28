
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
    // Get environment variables using the new names
    const supabaseUrl = Deno.env.get('PROJECT_URL');
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_SECRET');

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

    const { email, password, name, username, userType, phone, additionalData } = await req.json();
    console.log('Creating test user with details:', { email, name, username, userType });
    
    // Check for existing user using listUsers
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filters: {
        email: email
      }
    });

    if (listError) {
      console.error('Error looking up existing user:', listError);
      throw listError;
    }
    
    // If user already exists, return early with success
    if (existingUsers?.users?.length > 0) {
      console.log('User already exists:', existingUsers.users[0].id);
      return new Response(JSON.stringify({
        user: existingUsers.users[0],
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
        user_type: userType,
        phone
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
          user_type: userType,
          phone
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
    if (userType === 'establishment' && additionalData) {
      try {
        console.log('Creating establishment record...');
        const { error: establishmentError } = await supabase
          .from('establishments')
          .insert({
            name: additionalData.establishmentName || name,
            owner_id: userId,
            address: additionalData.address || "123 Test Street",
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // Add some variation
            longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
            cocktail_count: 0,
            phone: phone,
            website: `https://${username}.com`,
            capacity: additionalData.capacity || 100
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

    // If it's a promoter, create sample events and circuits
    if (userType === 'promoter') {
      try {
        console.log('Creating sample promoter data...');
        
        // Create a sample event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .insert({
            name: `Sample Event by ${name}`,
            description: 'A test event for MVP validation',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            time: '20:00',
            created_by: userId,
            status: 'draft',
            capacity: 100,
            is_public: true
          })
          .select()
          .single();

        if (!eventError && eventData) {
          // Create ticket types for the event
          await supabase
            .from('event_ticket_types')
            .insert([
              {
                event_id: eventData.id,
                name: 'General Admission',
                description: 'Standard entry ticket',
                price: 25.00,
                quantity: 80
              },
              {
                event_id: eventData.id,
                name: 'VIP',
                description: 'VIP experience with perks',
                price: 50.00,
                quantity: 20
              }
            ]);
        }

      } catch (promoterError) {
        console.error('Exception creating promoter data:', promoterError);
        // Continue execution
      }
    }

    return new Response(JSON.stringify({
      user: userData.user,
      message: 'Test user created successfully with sample data'
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
