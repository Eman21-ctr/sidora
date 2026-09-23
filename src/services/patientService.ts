import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Patient } from '../types';

export async function fetchPatients(): Promise<Patient[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('patients')
    .select('data')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data?.map(row => row.data as Patient) ?? [];
}

export async function upsertPatient(patient: Patient): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('patients')
    .upsert({
      id: patient.id,
      data: patient,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) throw error;
}

export async function upsertPatients(patients: Patient[]): Promise<void> {
  if (!isSupabaseConfigured || patients.length === 0) return;

  const rows = patients.map(p => ({
    id: p.id,
    data: p,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('patients')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;
}

export async function deletePatient(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteAllPatients(): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('patients')
    .delete()
    .neq('id', '');

  if (error) throw error;
}

