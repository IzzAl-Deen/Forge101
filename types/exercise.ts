export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced" | string;

export type Exercise = {
  id: number;
  name: string;
  target_muscle: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  difficulty: ExerciseDifficulty;
  category: string;
  created_at?: string;
  updated_at?: string;
};

export type LaravelPaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    active: boolean;
    label: string;
    url: string | null;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type PlanExerciseAttachmentInput = {
  exercise_id: number;
  sets: number;
  reps: number;
  day: string;
  order_index: number;
};
