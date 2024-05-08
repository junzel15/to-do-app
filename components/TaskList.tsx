import React from "react";
import { Task } from "../app/types/task";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";

interface TaskItemProps {
  task: Task;
  onDoneTask: (id: number) => void;
  onUpdateTask: (
    id: number,
    currentText: string,
    currentDescription: string
  ) => void;
  onDeleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDoneTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  return (
    <li
      key={task.id}
      className="border-b border-gray-600 py-4 grid grid-cols-3 gap-4"
    >
      <div>
        {task.completed ? (
          <p className="text-black-400">End Time: {task.endTime}</p>
        ) : (
          <p className="text-black-400">Start Time: {task.startTime}</p>
        )}
      </div>
      <div>
        <p className="text-lg font-bold text-black">Task: {task.text}</p>
        <p className="text-black">Description: {task.description}</p>
      </div>
      <div className="space-x-2 flex items-center">
        <button
          className="bg-green-500 text-white font-bold py-2 px-3 rounded hover:bg-green-700 focus:outline-none focus:bg-green-700 flex items-center"
          onClick={() => onDoneTask(task.id)}
        >
          <span className="mr-2">Done</span>
          <CheckIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onUpdateTask(task.id, task.text, task.description)}
          className="bg-yellow-500 text-white font-bold py-2 px-3 rounded hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700 flex items-center"
        >
          <span className="mr-2">Update</span>
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="bg-red-500 text-white font-bold py-2 px-3 rounded hover:bg-red-700 focus:outline-none focus:bg-red-700 flex items-center"
        >
          <span className="mr-2">Delete</span>
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
