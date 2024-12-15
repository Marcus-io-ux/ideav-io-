import { supabase } from './supabase';

export const fetchFeatures = async () => {
  const { data, error } = await supabase
    .from('features')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchCommunityInfo = async () => {
  const { data, error } = await supabase
    .from('community')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchPricingPlans = async () => {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchAboutInfo = async () => {
  const { data, error } = await supabase
    .from('about')
    .select('*');
  
  if (error) throw error;
  return data;
};