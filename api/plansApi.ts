import api from "./api";
import { Plan } from "../types/plan";

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

    delete: async (id: number) => {
        await api.delete(`/plans/${id}/`);
        return true;
    }

}

export default Plans;