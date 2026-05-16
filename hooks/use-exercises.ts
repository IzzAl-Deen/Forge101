import Exercises from "@/api/exerciseApi";
import type { ExerciseFilters } from "@/types/exercise";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

type FetchParams = {
  pageParam: number;
  search: string;
  filters: ExerciseFilters;
};

function cleanDifficulty(value: string | null) {
  return value?.toLowerCase() as
    | "beginner"
    | "intermediate"
    | "advanced"
    | undefined;
}

async function fetchExercises({ pageParam, search, filters }: FetchParams) {
  const page = pageParam + 1;

  const response = await Exercises.search({
    q: search.trim() || undefined,
    target_muscle: filters.target_muscle || undefined,
    category: filters.category || undefined,
    difficulty: cleanDifficulty(filters.difficulty),
    page,
    per_page: PAGE_SIZE,
  });

  return response.data;
}

export function useExercises(search: string, filters: ExerciseFilters) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["exercises", search, filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchExercises({ pageParam, search, filters }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  return {
    exercises: data?.pages.flat() ?? [],
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    isError,
    error,
    refetch,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  };
}