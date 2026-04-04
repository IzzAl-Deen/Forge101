export type Plan = {
  id?: number;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
//   exercises: Exercise[];
  duration?: number;
};