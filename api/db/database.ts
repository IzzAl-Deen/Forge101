import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("fitness.db");

export const initDatabase = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT,
                difficulty TEXT,
                duration_minutes INTEGER
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT,
                target_muscle TEXT,
                description TEXT,
                image_url TEXT
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS plan_exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_id INTEGER,
                exercise_id INTEGER,
                sets INTEGER,
                reps INTEGER,
                day TEXT,
                order_index INTEGER
            );
        `);

        console.log("Database initialized");
    } catch (error) {
        console.error("Database init failed", error);
    }
};