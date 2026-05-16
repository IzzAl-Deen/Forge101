import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type WorkoutSessionContextType = {
  selectedExerciseId: number | null;
  setSelectedExerciseId: (id: number | null) => void;
};

const WorkoutSessionContext = createContext<WorkoutSessionContextType | null>(null);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

  const value = useMemo(
    () => ({ selectedExerciseId, setSelectedExerciseId }),
    [selectedExerciseId]
  );

  return (
    <WorkoutSessionContext.Provider value={value}>
      {children}
    </WorkoutSessionContext.Provider>
  );
}

export function useWorkoutSessionContext() {
  const context = useContext(WorkoutSessionContext);

  if (!context) {
    throw new Error("WorkoutSessionProvider is missing");
  }

  return context;
}