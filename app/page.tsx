"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sezguqguycmsjppaimtw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlemd1cWd1eWNtc2pwcGFpbXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzNjk5MzYsImV4cCI6MjAyOTk0NTkzNn0.LGgeN65aJyajNLRvPK2_x3DzsAhnNfcWty_lVs3RTho";
const supabase = createClient(supabaseUrl, supabaseKey);

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
      const errorMessage = (error as Error).message;
      console.error("Error fetching tasks:", errorMessage);
    }
  };

  const handleTaskCreation = async () => {
    if (taskInput.trim() !== "") {
      try {
        const startTime = getCurrentDateTime();

        const { data, error }: { data: any; error: any } = await supabase
          .from("tasks")
          .insert([
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
        const { error }: { error: any } = await supabase
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

      const { error }: { error: any } = await supabase
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
        const { error }: { error: any } = await supabase
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
    <div className="container">
      <h1>To Do App</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <button onClick={handleTaskCreation}>Create</button>
      </div>
      <div>
        <h2>Ongoing Tasks</h2>
        {tasks.filter((task) => !task.completed).length > 0 ? (
          <ul>
            {tasks.map(
              (task) =>
                !task.completed && (
                  <li key={task.id}>
                    <div>
                      {task.completed ? (
                        <span>End Time: {task.endTime}</span>
                      ) : (
                        <span>Start Time: {task.startTime}</span>
                      )}
                      <span>Task: {task.text}</span>
                      <span>Description: {task.description}</span>
                    </div>
                    <div>
                      <button
                        className="blue-button"
                        onClick={() => handleDoneTasks(task.id)}
                      >
                        Done Tasks
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateTask(
                            task.id,
                            "New Task",
                            "New Description"
                          )
                        }
                      >
                        Update
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>
        ) : (
          <p>No ongoing tasks</p>
        )}
      </div>
      <div>
        <h2>Completed Tasks</h2>
        <ul>
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <li key={task.id}>
                <div>
                  <span>Start Time: {task.startTime}</span>
                  <span>End Time: {task.endTime}</span>
                  <span>Task: {task.text}</span>
                  <span>Description: {task.description}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="result-container">{result}</div>
    </div>
  );
};

export default Home;
