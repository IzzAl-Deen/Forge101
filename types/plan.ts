export type Plan = {
<<<<<<< Updated upstream
  user_id: string;

  name: string;
  difficulty: string;
  duration_minutes: number;
  
=======
  id?: number;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
//   exercises: Exercise[];
  duration?: number;
>>>>>>> Stashed changes
};