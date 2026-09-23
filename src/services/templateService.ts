import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MessageTemplate } from '../types';

export async function fetchTemplates(): Promise<MessageTemplate[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('message_templates')
    .select('data')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data?.map(row => row.data as MessageTemplate) ?? [];
}

export async function upsertTemplate(template: MessageTemplate): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('message_templates')
    .upsert({
      id: template.id,
      data: template,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) throw error;
}

export async function upsertTemplates(templates: MessageTemplate[]): Promise<void> {
  if (!isSupabaseConfigured || templates.length === 0) return;

  const rows = templates.map(t => ({
    id: t.id,
    data: t,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('message_templates')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;
}
