export type Plan = {
  user_id: string;
  name: string;
  difficulty: string;
  duration_minutes: number;
  image_url?: string | null;
  created_by_user_id?: string;
};