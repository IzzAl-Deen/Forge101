import apiBase from "./ApiBase";

export type UserProfile = {
	id: string;
	name: string;
	email: string;
	avatar_url: string | null;
};

const authApi = {
	getProfile: async (): Promise<UserProfile> => {
		const res = await apiBase.get("/user");
		return res.data;
	},

	updateProfile: async (data: { name?: string; avatar_url?: string | null }): Promise<UserProfile> => {
		const res = await apiBase.put("/user", data);
		return res.data.user;
	},
};

export default authApi;
