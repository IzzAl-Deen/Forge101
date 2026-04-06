import apiClient from "@/api/client";
import type {
  Exercise,
  LaravelPaginatedResponse,
  PlanExerciseAttachmentInput,
} from "@/types/exercise";

export async function fetchExercisesPage(page = 1, perPage = 100) {
  const response = await apiClient.get<LaravelPaginatedResponse<Exercise>>("/exercises/search", {
    params: {
      page,
      per_page: perPage,
    },
  });

  return response.data;
}

export async function fetchAllExercises(perPage = 100) {
  let page = 1;
  let lastPage = 1;
  const exercises: Exercise[] = [];

  do {
    const response = await fetchExercisesPage(page, perPage);

    exercises.push(...response.data);
    lastPage = response.last_page;
    page += 1;
  } while (page <= lastPage);

  return exercises;
}

export async function attachExercisesToPlan(
  planId: number,
  exercises: PlanExerciseAttachmentInput[]
) {
  await Promise.all(
    exercises.map((exercise) =>
      apiClient.post(`/plans/${planId}/exercises`, exercise)
    )
  );
}
