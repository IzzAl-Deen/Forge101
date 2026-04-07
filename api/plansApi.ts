import api from "./api";
import { Plan } from "../types/plan";

type AttachExerciseData = {
    exercise_id: number;
    sets: number;
    reps: number;
    day: string;
    order_index: number;
};

const Plans = {
    getAll: async () => {
        const response = await api.get("/plans/");
        return response.data;
    },

    getById : async (id : number) => {
        const response = await api.get(`/plans/${id}/`);
        return response.data;
    },

    create: async (plan: Plan) => {
        const response = await api.post("/plans/", plan);
        return response.data;
    },

    update: async (id: number, plan: Plan) => {
        const response = await api.put(`/plans/${id}/`, plan);
        return response.data;
    },

    attachExercise: async (planId: number, exercise: AttachExerciseData) => {
        const response = await api.post(`/plans/${planId}/exercises`, exercise);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/plans/${id}/`);
        return true;
    }

}

export default Plans;
