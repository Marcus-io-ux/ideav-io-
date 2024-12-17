-- Update the handle_new_user function to also create user_points
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create initial idea for the new user
  INSERT INTO public.ideas (user_id, title, content)
  VALUES (
    NEW.id,
    'My First Idea',
    'Welcome to Idea Vault! This is your first idea. Click to edit it or create a new one.'
  );
  
  -- Create user profile
  INSERT INTO public.profiles (id, user_id, username)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    split_part(NEW.email, '@', 1)
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create initial user points with streak
  INSERT INTO public.user_points (user_id, current_streak, points)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;