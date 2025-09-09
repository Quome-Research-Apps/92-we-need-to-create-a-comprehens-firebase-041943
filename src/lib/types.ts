export interface Grade {
  id: string;
  name: string;
  score: number;
  weight: number;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  grades: Grade[];
}
