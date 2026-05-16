import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("fitness.db");

export const initDatabase = async () => {
  try {
    await db.execAsync(`
            DROP TABLE IF EXISTS plans;
            DROP TABLE IF EXISTS exercises;
        `);

    await db.execAsync(`
            CREATE TABLE plans (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT,
                difficulty TEXT,
                duration_minutes INTEGER,
                image_url TEXT
            );
        `);

    await db.execAsync(`
            CREATE TABLE exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT,
                sets INTEGER,
                reps INTEGER,
                day TEXT,
                target_muscle TEXT,
                image_url TEXT
            );
        `);

    console.log("Database initialized");
  } catch (error) {
    console.error("Database init failed", error);
  }
};
