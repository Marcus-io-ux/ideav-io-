import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const channelContent = {
  general: {
    topics: ['productivity', 'life hacks', 'general improvements', 'daily routines', 'organization'],
    prefix: 'Here\'s an idea for improving daily life:'
  },
  business: {
    topics: ['startup ideas', 'business opportunities', 'market analysis', 'entrepreneurship', 'innovation'],
    prefix: 'Business opportunity spotted:'
  },
  tech: {
    topics: ['software development', 'AI applications', 'tech trends', 'coding projects', 'automation'],
    prefix: 'Tech innovation concept:'
  },
  lifestyle: {
    topics: ['health tips', 'wellness routines', 'mindfulness', 'work-life balance', 'personal growth'],
    prefix: 'Lifestyle enhancement idea:'
  },
  design: {
    topics: ['UI/UX concepts', 'creative projects', 'design trends', 'artistic inspiration', 'visual improvements'],
    prefix: 'Design concept proposal:'
  },
  apps: {
    topics: ['mobile apps', 'web applications', 'software tools', 'productivity apps', 'social platforms'],
    prefix: 'App concept:'
  }
};

const botUsers = [
  { username: 'IdeaBot', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=IdeaBot' },
  { username: 'InnovationAI', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=InnovationAI' },
  { username: 'CreativeMinds', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CreativeMinds' },
  { username: 'TechVision', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TechVision' },
  { username: 'FutureThink', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=FutureThink' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, create bot profiles if they don't exist
    for (const bot of botUsers) {
      const { data: existingProfile } = await supabaseClient
        .from('profiles')
        .select()
        .eq('username', bot.username)
        .single();

      if (!existingProfile) {
        const { data: newProfile, error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            username: bot.username,
            avatar_url: bot.avatar_url,
          })
          .select()
          .single();

        if (profileError) throw profileError;
      }
    }

    // Get all bot profiles
    const { data: botProfiles } = await supabaseClient
      .from('profiles')
      .select('user_id, username')
      .in('username', botUsers.map(bot => bot.username));

    // Generate posts for each channel
    for (const [channel, content] of Object.entries(channelContent)) {
      // Create 5 posts per channel
      for (let i = 0; i < 5; i++) {
        const randomBot = botProfiles[Math.floor(Math.random() * botProfiles.length)];
        const topic = content.topics[Math.floor(Math.random() * content.topics.length)];
        
        // Create post
        const { data: post, error: postError } = await supabaseClient
          .from('community_posts')
          .insert({
            user_id: randomBot.user_id,
            title: `${content.prefix} ${topic}`,
            content: `Here's a thoughtful idea about ${topic} that could make a real difference...`,
            channel: channel,
            tags: [topic, channel],
          })
          .select()
          .single();

        if (postError) throw postError;

        // Add some likes
        const numLikes = Math.floor(Math.random() * 10) + 1;
        for (let j = 0; j < numLikes; j++) {
          const likeBot = botProfiles[Math.floor(Math.random() * botProfiles.length)];
          await supabaseClient
            .from('community_post_likes')
            .insert({
              post_id: post.id,
              user_id: likeBot.user_id,
            });
        }

        // Add some comments
        const numComments = Math.floor(Math.random() * 5) + 1;
        for (let k = 0; k < numComments; k++) {
          const commentBot = botProfiles[Math.floor(Math.random() * botProfiles.length)];
          await supabaseClient
            .from('community_comments')
            .insert({
              post_id: post.id,
              user_id: commentBot.user_id,
              content: `Interesting perspective on ${topic}! Here's what I think...`,
            });
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Successfully populated channels with bot content' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});