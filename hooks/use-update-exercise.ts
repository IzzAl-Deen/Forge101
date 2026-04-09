import { PendingExercise } from "@/components/plan-exercises";


type Props = {
    exercises?: PendingExercise[];
    onExercisesChange?: (exercises: PendingExercise[]) => void;
};


export const useUpdateExercise = ({ exercises, onExercisesChange }: Props) => {
   
    const updateExercise = (
        index: number,
        field: "sets" | "reps",
        value: string,
    ) => {
        if (!exercises || !onExercisesChange) {
            return;
        }

        onExercisesChange(
            exercises.map((exercise, itemIndex) =>
                itemIndex === index ? { ...exercise, [field]: value } : exercise,
            ),
        );
    };

    return { updateExercise };
};
