import apiBase from './apiBase';

export interface Plan {
  id: string;
  name: string;
  difficulty: string;
  duration_minutes: number;
  frequency?: string; 
  image_url?: string;
}

export const planService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await apiBase.get('/plans');
    return response.data;
  },
};
