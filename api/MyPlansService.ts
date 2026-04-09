import apiBase from './ApiBase';

export interface Plan {
  id: string;
  name: string;
  difficulty: string;
  duration_minutes: number;
  frequency?: string;
  image_url?: string;
}

export interface PlanExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  day: string;
  image_url?: string;
}

export const myPlansService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiBase.get('/plans');
    return response.data;
  },

getPlanExercises: async (planId: string): Promise<PlanExercise[]> => {
  const response = await apiBase.get(`/plans/${planId}/exercises`);
  const data = response.data;

  return (data.exercises || []).map((exercise: any) => ({
    id: exercise.id,
    name: exercise.name,
    image_url: exercise.image_url,
    sets: exercise.pivot?.sets || 0,
    reps: exercise.pivot?.reps || 0,
    day: exercise.pivot?.day || 'Not Set',
  }));
},

  getPlanById: async (planId: string) => {
    const response = await apiBase.get(`/plans/${planId}`);
    return response.data;
  },

  detachExercise: async (planId: string, exerciseId: number) => {
    const response = await apiBase.delete(`/plans/${planId}/exercises/${exerciseId}`);
    return response.data;
  },

  updateAttachedExercise: async (planId: string, exerciseId: number, data: any) => {
    const response = await apiBase.put(`/plans/${planId}/exercises/${exerciseId}`, data);
    return response.data;
  }
};
