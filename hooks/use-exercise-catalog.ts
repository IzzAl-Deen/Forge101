import { isAxiosError } from "axios";
import { startTransition, useCallback, useEffect, useState } from "react";

import { fetchAllExercises } from "@/api/exercises";
import type { Exercise } from "@/types/exercise";

type UseExerciseCatalogOptions = {
  enabled?: boolean;
  initialExercises?: Exercise[];
};

function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.data?.message && typeof error.response.data.message === "string") {
      return error.response.data.message;
    }

    if (error.response?.status === 401) {
      return "Your session expired. Sign in again, then reload the exercise list.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading exercises.";
}

export function useExerciseCatalog(options?: UseExerciseCatalogOptions) {
  const enabled = options?.enabled ?? true;
  const [exercises, setExercises] = useState<Exercise[]>(options?.initialExercises ?? []);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async (refresh = false) => {
    if (!enabled) {
      return;
    }

    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await fetchAllExercises();

      startTransition(() => {
        setExercises(data);
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    void loadCatalog();
  }, [enabled, loadCatalog]);

  return {
    exercises,
    isLoading,
    isRefreshing,
    error,
    reload: () => void loadCatalog(),
    refresh: () => void loadCatalog(true),
  };
}
