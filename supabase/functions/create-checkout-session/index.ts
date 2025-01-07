import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
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
    const { userId, email, returnUrl } = await req.json();

    if (!userId || !email || !returnUrl) {
      throw new Error('Missing required parameters');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create or retrieve customer
    const customers = await stripe.customers.list({ email });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: {
          supabaseUserId: userId,
        },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: 'price_1QeYAuLL02NvbAdXZ3YondMr', // Your Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}`,
      metadata: {
        supabaseUserId: userId,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});