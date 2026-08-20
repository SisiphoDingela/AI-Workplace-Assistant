import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Activity = {
  id: string;
  tool: 'email' | 'meeting' | 'task';
  title: string;
  summary: string | null;
  created_at: string;
};

export async function logActivity(tool: Activity['tool'], title: string, summary?: string) {
  const { error } = await supabase
    .from('activities')
    .insert({ tool, title, summary: summary ?? null });
  if (error) console.error('Failed to log activity:', error.message);
}

export async function fetchActivities(limit = 20): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('id, tool, title, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Failed to fetch activities:', error.message);
    return [];
  }
  return (data ?? []) as Activity[];
}

export async function fetchActivityStats(): Promise<{ total: number; byTool: Record<string, number> }> {
  const { data, error } = await supabase
    .from('activities')
    .select('tool');
  if (error) {
    console.error('Failed to fetch stats:', error.message);
    return { total: 0, byTool: {} };
  }
  const rows = data ?? [];
  const byTool: Record<string, number> = {};
  for (const row of rows) {
    byTool[row.tool] = (byTool[row.tool] ?? 0) + 1;
  }
  return { total: rows.length, byTool };
}
