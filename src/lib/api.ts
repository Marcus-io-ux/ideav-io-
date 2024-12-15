import { supabase } from './supabase';
import { AboutInfo } from '@/types/api';

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

export const fetchAboutInfo = async (): Promise<AboutInfo> => {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();
  
  if (error) throw error;
  
  // Transform the data to match the AboutInfo interface
  return {
    missionStatement: data?.mission_statement || 'Our mission is to help people capture and organize their ideas.',
    teamMembers: data?.team_members || [
      {
        name: 'John Doe',
        role: 'CEO',
        bio: 'Passionate about helping people organize their ideas.',
        photoUrl: '/placeholder.svg'
      },
      {
        name: 'Jane Smith',
        role: 'CTO',
        bio: 'Technical expert with a vision for innovation.',
        photoUrl: '/placeholder.svg'
      }
    ],
    companyHistory: data?.company_history || [
      { date: '2023', event: 'Company Founded' }
    ],
    contactLinks: data?.contact_links || {
      email: 'contact@ideavault.com',
      socialMedia: [
        { platform: 'Twitter', url: 'https://twitter.com/ideavault' }
      ]
    }
  };
};
