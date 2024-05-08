import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseKey } from "./supabase";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
