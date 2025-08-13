
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of a single task
export type Task = {
  id: number;
  title: string;
  subject: string;
  dueDate: string; // Storing as ISO string 'yyyy-MM-dd'
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
};

// Define the shape of the form input, which omits the generated fields
export type TaskFormInput = Omit<Task, 'id' | 'completed'>;

// Define the shape of the context
interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: TaskFormInput) => void;
  editTask: (taskId: number, taskData: TaskFormInput) => void;
  deleteTask: (taskId: number) => void;
  toggleTaskComplete: (taskId: number) => void;
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create the provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = (taskData: TaskFormInput) => {
    const newTask: Task = {
      id: Date.now(), // Use timestamp for unique ID
      completed: false,
      ...taskData,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const editTask = (taskId: number, taskData: TaskFormInput) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...taskData } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskComplete = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask, toggleTaskComplete }}>
      {children}
    </TaskContext.Provider>
  );
}

// Create a custom hook for using the context
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
