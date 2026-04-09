import apiBase from "./ApiBase";

export type Exercise = {
  id?: number;
  name: string;
  target_muscle: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
};

export type LaravelPaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type ExerciseSearchParams = {
  q?: string;
  category?: string;
  target_muscle?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  page?: number;
  per_page?: number;
};

const Exercises = {
  getAll: async (
    page = 1,
    perPage = 15,
  ): Promise<LaravelPaginatedResponse<Exercise>> => {
    const response = await apiBase.get("/exercises", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Exercise> => {
    const response = await apiBase.get(`/exercises/${id}`);
    return response.data;
  },

  search: async (
    params: ExerciseSearchParams = {},
  ): Promise<LaravelPaginatedResponse<Exercise>> => {
    const response = await apiBase.get("/exercises/search", {
      params: {
        q: params.q,
        category: params.category,
        target_muscle: params.target_muscle,
        difficulty: params.difficulty,
        page: params.page ?? 1,
        per_page: params.per_page ?? 10,
      },
    });
    return response.data;
  },

  create: async (exercise: Exercise) => {
    const response = await apiBase.post("/exercises", exercise);
    return response.data;
  },

  update: async (id: number, exercise: Partial<Exercise>) => {
    const response = await apiBase.put(`/exercises/${id}`, exercise);
    return response.data;
  },

  delete: async (id: number): Promise<boolean> => {
    await apiBase.delete(`/exercises/${id}`);
    return true;
  },
};

export default Exercises;
