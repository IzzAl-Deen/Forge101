export type Plan = {
  id?: number;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: number;
  image_url?: string | null;
  created_by_user_id?: string;
};