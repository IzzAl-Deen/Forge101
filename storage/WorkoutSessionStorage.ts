import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_PLAN_KEY = "last_opened_plan_id";

export const workoutStorage = {
  saveLastPlan: async (planId: string) => {
    await AsyncStorage.setItem(LAST_PLAN_KEY, planId);
  },

  getLastPlan: async () => {
    return AsyncStorage.getItem(LAST_PLAN_KEY);
  },
};