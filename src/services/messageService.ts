import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { WhatsAppMessage } from '../types';

export async function fetchMessages(): Promise<WhatsAppMessage[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('data')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(row => row.data as WhatsAppMessage) ?? [];
}

export async function insertMessage(msg: WhatsAppMessage): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('whatsapp_messages')
    .insert({
      id: msg.id,
      data: msg,
    });

  if (error) throw error;
}

export async function insertMessages(msgs: WhatsAppMessage[]): Promise<void> {
  if (!isSupabaseConfigured || msgs.length === 0) return;

  const rows = msgs.map(m => ({
    id: m.id,
    data: m,
  }));

  const { error } = await supabase
    .from('whatsapp_messages')
    .insert(rows);

  if (error) throw error;
}

export async function updateMessage(msg: WhatsAppMessage): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('whatsapp_messages')
    .update({ data: msg })
    .eq('id', msg.id);

  if (error) throw error;
}

export async function deleteAllMessages(): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('whatsapp_messages')
    .delete()
    .neq('id', '');

  if (error) throw error;
}

