export type Exercise = {
  id: number;
  name: string;
  target_muscle: string;
  description: string;
  image_url: string;
  video_url: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
};

export type ExerciseFilters = {
  target_muscle: string | null;
  difficulty: string | null;
  category: string | null;
};

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const CATEGORIES = [
  "Chest", "Back", "Arms",
  "Shoulders", "Legs", 
];

export const MUSCLES = [
  "Chest", "Back", "Biceps", "Triceps",
  "Shoulders", "Quads", "Hamstrings",
 "Core", "Posterior Chain",
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#4CAF50",
  intermediate: "#FFC107",
  advanced: "#F44336",
};