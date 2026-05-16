import { db } from "./database";

export type CachedExercise = {
    id: number;
    name: string;
    target_muscle?: string;
    image_url?: string;

    sets?: number;
    reps?: number;
    day?: string;

};

export const saveExercises = async (
    exercises: CachedExercise[]
) => {
    try {
        await db.execAsync("DELETE FROM exercises;");

        for (const exercise of exercises) {
            await db.runAsync(
                `
                INSERT INTO exercises (
                    id,
                    name,
                    target_muscle,
                    image_url,
                    sets,
                    reps,
                    day
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    exercise.id,
                    exercise.name,
                    exercise.target_muscle || "",
                    exercise.image_url || "",
                    exercise.sets || 0,
                    exercise.reps || 0,
                    exercise.day || "",
                ]
            );
        }
    } catch (error) {
        console.error("Failed saving exercises", error);
    }
};

export const getExercises = async (): Promise<CachedExercise[]> => {
    try {
        const result = await db.getAllAsync<CachedExercise>(
            "SELECT * FROM exercises"
        );

        return result.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            target_muscle: exercise.target_muscle,
            image_url: exercise.image_url,

            pivot: {
                sets: exercise.sets,
                reps: exercise.reps,
                day: exercise.day,
            },
        }));
    } catch (error) {
        console.error("Failed loading exercises", error);
        return [];
    }
};