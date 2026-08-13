import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase istemcisi başlatılamadı: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ortam değişkenleri eksik (.env.local dosyasını kontrol edin).",
  );
}

/** Tüm istemci tarafı ve sunucu tarafı sorgular için paylaşılan Supabase istemcisi. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
