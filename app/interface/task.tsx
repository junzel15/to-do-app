export interface Task {
  id: number;
  text: string;
  description: string;
  startTime: string;
  endTime: string | null;
  completed: boolean;
}
