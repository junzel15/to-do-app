import { Task } from "../interface/task";
import supabase from "../supabase/supabaseClient";

async function fetchData(): Promise<Task[] | null> {
  try {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      throw error;
    }

    return data || null;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

export default fetchData;
