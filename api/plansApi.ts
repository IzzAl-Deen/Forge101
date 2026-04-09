import apiBase from "./ApiBase";
import { Plan } from "../types/plan";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type AttachExerciseData = {
    exercise_id: number;
    sets: number;
    reps: number;
    day: string;
    order_index: number;
};

const Plans = {
    getAll: async () => {
        const response = await apiBase.get("/plans/");
        return response.data;
    },

    getById : async (id : number) => {
        const response = await apiBase.get(`/plans/${id}/`);
        return response.data;
    },

    create: async (plan: Plan) => {
        const response = await apiBase.post("/plans/", plan);
        return response.data;
    },

    update: async (id: number, plan: Plan) => {
        const response = await apiBase.put(`/plans/${id}/`, plan);
        return response.data;
    },

    attachExercise: async (planId: number, exercise: AttachExerciseData) => {
        const response = await apiBase.post(`/plans/${planId}/exercises`, exercise);
        return response.data;
    },

    getExercises: async (planId: number) => {
        const response = await apiBase.get(`/plans/${planId}/exercises`);
        return response.data;
    },

    deleteExercise: async (planId: number, exerciseId: number) => {
        const response = await apiBase.delete(`/plans/${planId}/exercises/${exerciseId}`);
        return response.data;
    },

    delete: async (id: number) => {
        await apiBase.delete(`/plans/${id}/`);
        return true;
    }

}

export default Plans;
