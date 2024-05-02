"use client";

import React, { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sezguqguycmsjppaimtw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlemd1cWd1eWNtc2pwcGFpbXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzNjk5MzYsImV4cCI6MjAyOTk0NTkzNn0.LGgeN65aJyajNLRvPK2_x3DzsAhnNfcWty_lVs3RTho";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<
    {
      id: number;
      text: string;
      description: string;
      startTime: string;
      endTime: string;
      completed: boolean;
    }[]
  >([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*");

      if (error instanceof Error) {
        throw error;
      }

      if (data) {
        setTasks(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching tasks:", errorMessage);
    }
  };

  const handleTaskCreation = async () => {
    if (taskInput.trim() !== "") {
      try {
        const startTime = getCurrentDateTime();

        const { data, error } = await supabase.from("tasks").insert([
          {
            text: taskInput,
            description: taskDescription,
            startTime: startTime,
            endTime: null,
            completed: false,
          },
        ]);

        if (error) {
          throw error;
        }

        setResult("Task created successfully");
        setTaskInput("");
        setTaskDescription("");

        fetchTasks();
      } catch (error: any) {
        if (error && error.message) {
          console.error("Error creating task:", error.message);
          setResult("Error creating task");
        } else {
          console.error("Unknown error occurred while creating task:", error);
          setResult("Unknown error occurred while creating task");
        }
      }
    } else {
      setResult("Please enter a task");
    }
  };

  const handleDoneTasks = async (taskId: number) => {
    console.log("Task ID:", taskId);

    const confirmation = window.confirm(
      "Are you sure to mark this task as done?"
    );

    if (confirmation) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ completed: true, endTime: getCurrentDateTime() })
          .eq("id", taskId);

        if (error) {
          throw error;
        }

        setResult("Task marked as done");
        fetchTasks();
      } catch (error: any) {
        console.error("Error marking task as done:", error.message);
        setResult("Error marking task as done");
      }
    } else {
      setResult("Task marking as done canceled");
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    currentText: string,
    currentDescription: string
  ) => {
    console.log("Task ID:", taskId);
    try {
      const newText = prompt("Enter new task text:", currentText);
      const newDescription = prompt(
        "Enter new task description:",
        currentDescription
      );

      if (!newText && !newDescription) {
        console.log("No changes made. Exiting update task.");
        return;
      }

      const { error } = await supabase
        .from("tasks")
        .update({ text: newText, description: newDescription })
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      setResult("Task updated successfully");
      fetchTasks();
    } catch (error: any) {
      console.error("Error updating task:", error.message);
      setResult("Error updating task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    console.log("Task ID:", taskId);
    const confirmation = window.confirm("Are you sure to delete this task?");
    if (confirmation) {
      try {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId);

        if (error) {
          throw error;
        }

        setResult("Task deleted successfully");
        fetchTasks();
      } catch (error: any) {
        console.error("Error deleting task:", error.message);
        setResult("Error deleting task");
      }
    }
  };

  const getCurrentDateTime = (): string => {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "2-digit",
      year: "numeric",
    }).format(now);
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div>
      <div className="container mx-auto px-2 py-3 bg-teal-100 text-black rounded-lg shadow-lg border-solid border-2 border-indigo-600">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          To Do App
        </h1>
        <div className="flex flex-col md:flex-row mb-6">
          <input
            type="text"
            placeholder="Enter task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="p-2 border border-gray-600 rounded mr-2 mb-2 md:w-1/3 focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="p-2 border border-gray-600 rounded mr-2 mb-2 md:w-1/3 focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
          />
          <button
            onClick={handleTaskCreation}
            className="bg-blue-500 text-white font-bold py-2 px-3 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Create
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Ongoing Tasks</h2>
          {tasks.filter((task) => !task.completed).length > 0 ? (
            <ul>
              {tasks.map(
                (task) =>
                  !task.completed && (
                    <li
                      key={task.id}
                      className="border-b border-gray-600 py-4 grid grid-cols-3 gap-4"
                    >
                      <div>
                        {task.completed ? (
                          <p className="text-black-400">
                            End Time: {task.endTime}
                          </p>
                        ) : (
                          <p className="text-black-400">
                            Start Time: {task.startTime}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-black">
                          Task: {task.text}
                        </p>
                        <p className="text-black">
                          Description: {task.description}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="bg-green-500 text-white font-bold py-2 px-3 rounded hover:bg-green-700 focus:outline-none focus:bg-green-700"
                          onClick={() => handleDoneTasks(task.id)}
                        >
                          Done
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateTask(
                              task.id,
                              "New Task",
                              "New Description"
                            )
                          }
                          className="bg-yellow-500 text-white font-bold py-2 px-3 rounded hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-500 text-white font-bold py-2 px-3 rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p className="text-gray-400">No ongoing tasks</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Completed Tasks</h2>
          {tasks.filter((task) => task.completed).length > 0 ? (
            <ul>
              {tasks.map(
                (task) =>
                  task.completed && (
                    <li
                      key={task.id}
                      className="border-b border-gray-600 py-4 grid grid-cols-3 gap-4"
                    >
                      <div>
                        <p className="text-black-400">
                          Start Time: {task.startTime}
                        </p>
                        <p className="text-black-400">
                          End Time: {task.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-black">
                          Task: {task.text}
                        </p>
                        <p className="text-black">
                          Description: {task.description}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateTask(
                              task.id,
                              "New Task",
                              "New Description"
                            )
                          }
                          className="bg-yellow-500 text-white font-bold py-2 px-3 rounded hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-500 text-white font-bold py-2 px-3 rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p className="text-gray-400">No completed tasks</p>
          )}
        </div>
        <div className="result-container text-center text-gray-400 mt-6">
          {result}
        </div>
      </div>
      <footer className="text-center mt-6 text-black-400 ">
        &copy; 2024 TO DO APP TITO SOLUTIONS
      </footer>
    </div>
  );
};

export default Home;
