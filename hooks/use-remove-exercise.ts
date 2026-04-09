import { PendingExercise } from "@/components/plan-exercises";

type Props = {
    exercises?: PendingExercise[];
    onExercisesChange?: (exercises: PendingExercise[]) => void;
};

export const useRemoveExercise = ({ exercises, onExercisesChange }: Props) => {
   
    const removeExercise = (index: number) => {
    if (!exercises || !onExercisesChange) {
        return;
    }

    onExercisesChange(exercises.filter((_, itemIndex) => itemIndex !== index));
    };

    return { removeExercise };
};