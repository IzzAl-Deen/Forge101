import { useRemoveExercise } from "@/hooks/use-remove-exercise";
import { act, renderHook } from "@testing-library/react-native";

describe("useRemoveExercise", () => {
  it("returns removeExercise function", () => {
    const { result } = renderHook(() => useRemoveExercise({}));
    expect(result.current.removeExercise).toBeDefined();
    expect(typeof result.current.removeExercise).toBe("function");
  });

  it("removes exercise at the specified index", () => {
    const exercises = [
      {
        exercise_id: 1,
        name: "Push-ups",
        sets: "3",
        reps: "10",
        day: ["Monday"],
      },
      {
        exercise_id: 2,
        name: "Squats",
        sets: "3",
        reps: "12",
        day: ["Monday"],
      },
      {
        exercise_id: 3,
        name: "Lunges",
        sets: "3",
        reps: "10",
        day: ["Tuesday"],
      },
    ];
    const onExercisesChange = jest.fn();

    const { result } = renderHook(() =>
      useRemoveExercise({ exercises, onExercisesChange }),
    );

    act(() => {
      result.current.removeExercise(1);
    });

    expect(onExercisesChange).toHaveBeenCalledWith([
      {
        exercise_id: 1,
        name: "Push-ups",
        sets: "3",
        reps: "10",
        day: ["Monday"],
      },
      {
        exercise_id: 3,
        name: "Lunges",
        sets: "3",
        reps: "10",
        day: ["Tuesday"],
      },
    ]);
  });

  it("does nothing if exercises is undefined", () => {
    const onExercisesChange = jest.fn();

    const { result } = renderHook(() =>
      useRemoveExercise({ onExercisesChange }),
    );

    act(() => {
      result.current.removeExercise(0);
    });

    expect(onExercisesChange).not.toHaveBeenCalled();
  });

  it("does nothing if onExercisesChange is undefined", () => {
    const exercises = [
      {
        exercise_id: 1,
        name: "Push-ups",
        sets: "3",
        reps: "10",
        day: ["Monday"],
      },
    ];

    const { result } = renderHook(() => useRemoveExercise({ exercises }));

    act(() => {
      result.current.removeExercise(0);
    });

    expect(result.current.removeExercise).toBeDefined();
  });

  it("removes first exercise when index is 0", () => {
    const exercises = [
      {
        exercise_id: 1,
        name: "Push-ups",
        sets: "3",
        reps: "10",
        day: ["Monday"],
      },
      {
        exercise_id: 2,
        name: "Squats",
        sets: "3",
        reps: "12",
        day: ["Monday"],
      },
    ];
    const onExercisesChange = jest.fn();

    const { result } = renderHook(() =>
      useRemoveExercise({ exercises, onExercisesChange }),
    );

    act(() => {
      result.current.removeExercise(0);
    });

    expect(onExercisesChange).toHaveBeenCalledWith([
      {
        exercise_id: 2,
        name: "Squats",
        sets: "3",
        reps: "12",
        day: ["Monday"],
      },
    ]);
  });
});
