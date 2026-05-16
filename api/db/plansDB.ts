import { db } from "./database";

export type CachedPlan = {
    id: number;
    name: string;
    difficulty: string;
    duration_minutes: number;
    image_url?: string;
};

export const savePlans = async (plans: CachedPlan[]) => {
    try {
        await db.execAsync("DELETE FROM plans;");

        for (const plan of plans) {
            await db.runAsync(
                `
                INSERT INTO plans (
                    id,
                    name,
                    difficulty,
                    duration_minutes,
                    image_url
                ) VALUES (?, ?, ?, ?, ?)
                `,
                [
                    plan.id,
                    plan.name,
                    plan.difficulty,
                    plan.duration_minutes,
                    plan.image_url || "",
                ]
            );
        }
    } catch (error) {
        console.error("Failed saving plans", error);
    }
};

export const getPlans = async (): Promise<CachedPlan[]> => {
    try {
        const result = await db.getAllAsync<CachedPlan>(
            "SELECT * FROM plans"
        );

        return result;
    } catch (error) {
        console.error("Failed loading plans", error);
        return [];
    }
};