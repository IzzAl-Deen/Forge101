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
  day: string[];
  image_url?: string;
  originalIds: number[];
}

export interface UserPlan {
  id: number;
  plan_id: number;
  user_id: number;
  progress_percent: number;
  is_completed: boolean;
  plan: Plan;
}

export const myPlansService = {

  getUserSubscriptions: async (): Promise<UserPlan[]> => {
    const response = await apiBase.get('/user-plans');
    return response.data;
  },

  getPlans: async (): Promise<Plan[]> => {
    const response = await apiBase.get('/plans');
    return response.data;
  },

  getPlanExercises: async (planId: string): Promise<PlanExercise[]> => {
    const response = await apiBase.get(`/plans/${planId}/exercises`);
    const rawExercises = response.data.exercises || [];

    const grouped = rawExercises.reduce((acc: PlanExercise[], current: any) => {

      const existing = acc.find(item =>
          item.id === current.id &&
          Number(item.sets) === Number(current.pivot?.sets) &&
          Number(item.reps) === Number(current.pivot?.reps)
      );

      if (existing) {
        const currentDay = current.pivot?.day;
        if (currentDay && !existing.day.includes(currentDay)) {
          existing.day.push(currentDay);
        }
        existing.originalIds.push(current.pivot.id);

      } else {
        acc.push({
          id: current.id,
          name: current.name,
          image_url: current.image_url,
          sets: Number(current.pivot?.sets) || 0,
          reps: Number(current.pivot?.reps) || 0,
          day: current.pivot?.day ? [current.pivot.day] : [],
          originalIds: [current.pivot.id]
        });
      }

      return acc;
    }, []);

    return grouped;
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
  },

getUserPlanById: async (userPlanId: string | number) => {
  const response = await apiBase.get(`/user-plans/${userPlanId}`);
  return response.data;
},

completeExercise: async (userPlanId: number, exerciseId: number) => {
  const response = await apiBase.post(
    `/user-plans/${userPlanId}/complete-exercise/${exerciseId}`
  );

  return response.data;
},

unsubscribe: async (userPlanId: number) => {
  const response = await apiBase.delete(`/user-plans/${userPlanId}`);
  return response.data;
},

subscribe: async (planId: number) => {
  const response = await apiBase.post("/user-plans", {
    plan_id: planId,
    start_date: new Date().toISOString().split("T")[0],
  });

  return response.data;
},


};
