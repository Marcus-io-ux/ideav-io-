import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const [userName, setUserName] = useState("");

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: profile, error } = await supabase
        .from('onboarding_data')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('onboarding_data')
          .insert([{ 
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'User'
          }])
          .select('full_name')
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserName("User");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { userName };
};