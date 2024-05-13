"use server";

import supabase from "./supabase/supabaseClient";
import TodoHome from "./components/TodoHome";
import { Task } from "./interface/task";

async function Home() {
  try {
    const { data: tasks, error } = await supabase.from("tasks").select("*");

    if (error) {
      throw error;
    }

    const typedTasks: Task[] = tasks || [];

    return <TodoHome Tasks={typedTasks} error={null} />;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <TodoHome Tasks={[]} error={errorMessage} />;
  }
}

export default Home;
