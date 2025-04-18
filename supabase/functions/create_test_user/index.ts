
// This Edge Function provides an alternative way to create test users when the normal method fails
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { email, password, name, username, userType } = await req.json();

    // Create Supabase client with service role (admin) to bypass RLS policies
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create the user in auth.users
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        username,
        user_type: userType
      }
    });

    if (signUpError) throw signUpError;
    
    const userId = authData.user.id;

    // Insert the profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username,
        display_name: name,
        user_type: userType
      });

    if (profileError) console.warn("Profile creation error:", profileError);

    // Insert the role record
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: userType,
        is_active: true
      });

    if (roleError) console.warn("Role creation error:", roleError);

    // If establishment, create a test establishment
    if (userType === 'establishment') {
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

      if (establishmentError) console.warn("Establishment creation error:", establishmentError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test user created successfully",
        user: authData.user
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Test user creation error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        error
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
