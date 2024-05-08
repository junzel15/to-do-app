import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: () => void;
  taskInput: string;
  setTaskInput: React.Dispatch<React.SetStateAction<string>>;
  taskDescription: string;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  taskInput,
  setTaskInput,
  taskDescription,
  setTaskDescription,
}) => {
  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div
        className="modal-overlay fixed inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="modal-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-1/2 md:max-w-lg rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Create New Task</p>
            <span className="modal-close cursor-pointer z-50" onClick={onClose}>
              &times;
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="modal-input mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="modal-input mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={onCreateTask}
            className="modal-button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 flex items-center"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
