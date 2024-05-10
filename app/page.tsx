"use server";

import supabase from "./supabase/supabaseClient";
import TodoHome from "./components/TodoHome";

const Home: React.FC = async () => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) {
    throw error;
  }

  return <TodoHome tasks={data} />;
};

export default Home;
