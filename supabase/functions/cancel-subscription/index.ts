import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('Missing user ID');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user's active subscription from user_memberships
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (membershipError) {
      console.error('Error fetching membership:', membershipError);
      throw membershipError;
    }

    if (!membership) {
      return new Response(
        JSON.stringify({ 
          statusCode: 404,
          message: 'No active subscription found' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Update membership status in database
    const { error: updateError } = await supabaseAdmin
      .from('user_memberships')
      .update({ 
        status: 'cancelled',
        end_date: new Date().toISOString()
      })
      .eq('id', membership.id);

    if (updateError) {
      console.error('Error updating membership:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        message: 'Subscription cancelled successfully',
        membership: membership 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        statusCode: error.statusCode || 400
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.statusCode || 400,
      }
    );
  }
});