"use client";

import { FunctionComponent, useState } from "react";
import { Task } from "../types/task";
import supabase from "../supabase/supabaseClient";
import { PencilIcon, CheckCircleIcon } from "@heroicons/react/outline";
import TaskList from "./TaskList";
import Modal from "./Modal";

interface TodoHomeProps {
  tasks: Task[];
}

const TodoHome: FunctionComponent<TodoHomeProps> = (props) => {
  const { tasks } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTaskInput, setModalTaskInput] = useState<string>("");
  const [modalTaskDescription, setModalTaskDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleTaskCreation = async () => {
    if (modalTaskInput.trim() !== "") {
      try {
        const startTime = getCurrentDateTime();
        const { data, error } = await supabase.from("tasks").insert([
          {
            text: modalTaskInput,
            description: modalTaskDescription,
            startTime: startTime,
            endTime: null,
            completed: false,
          },
        ]);
        if (error) {
          throw error;
        }
        setResult("Task created successfully");
        setModalTaskInput("");
        setModalTaskDescription("");
        setModalOpen(false);
      } catch (error) {
        console.error(
          "Error creating task:",
          error instanceof Error ? error.message : error
        );
        setResult("Error creating task");
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
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-3 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 flex items-center"
          >
            <span className="mr-2">Create</span>
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-black flex items-center">
            <span className="mr-2">Ongoing Tasks</span>
            <CheckCircleIcon className="h-6 w-6" />
          </h2>
          {tasks && tasks.filter((task) => !task.completed).length > 0 ? (
            <ul>
              {tasks.map(
                (task) =>
                  !task.completed && (
                    <TaskList
                      key={task.id}
                      task={task}
                      onDoneTask={handleDoneTasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  )
              )}
            </ul>
          ) : (
            <p className="text-gray-400">No ongoing tasks</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-black flex items-center">
            <span className="mr-2">Completed Tasks</span>
            <CheckCircleIcon className="h-6 w-6" />
          </h2>
          {tasks && tasks.filter((task) => task.completed).length > 0 ? (
            <ul>
              {tasks.map(
                (task) =>
                  task.completed && (
                    <TaskList
                      key={task.id}
                      task={task}
                      onDoneTask={handleDoneTasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                    />
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
      <footer className="text-center mt-6 text-black-400">
        &copy; 2024 TO DO APP ELVIS
      </footer>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateTask={handleTaskCreation}
        taskInput={modalTaskInput}
        setTaskInput={setModalTaskInput}
        taskDescription={modalTaskDescription}
        setTaskDescription={setModalTaskDescription}
      />
    </div>
  );
};

export default TodoHome;
