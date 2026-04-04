import api from "./api";

const Plans = {
    getAll: async () => {
        const response = await api.get("/plans/");
        return response.data;
    },

    getById : async (id) => {
        const response = await api.get(`/plans/${id}/`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post("/plans/", data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/plans/${id}/`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/plans/${id}/`);
        return true;
    }

}

export default Plans;