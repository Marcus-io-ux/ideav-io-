import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const [userName, setUserName] = useState("");

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (profile?.username) {
        setUserName(profile.username);
      } else {
        // Fallback to email username if no profile username is set
        setUserName(user.email?.split('@')[0] || 'User');
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