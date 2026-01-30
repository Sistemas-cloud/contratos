/**
 * Cliente de Supabase para uso en el cliente (navegador)
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Cliente singleton para uso en componentes
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
};
