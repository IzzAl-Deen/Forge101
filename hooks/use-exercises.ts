import { supabase } from "@/lib/supabase";
import type { Exercise, ExerciseFilters } from "@/types/exercise";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

async function fetchExercises({
  pageParam,
  search,
  filters,
}: {
  pageParam: number;
  search: string;
  filters: ExerciseFilters;
}) {
  let query = supabase
    .from("exercises")
    .select("*")
    .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

  const cleanSearch = search.trim();

  if (cleanSearch) {
    query = query.or(
      `name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
    );
  }

  if (filters.target_muscle) {
    query = query.ilike("target_muscle", `%${filters.target_muscle}%`);
  }

  if (filters.difficulty) {
    query = query.ilike("difficulty", `%${filters.difficulty}%`);
  }

  if (filters.category) {
    query = query.ilike("category", `%${filters.category}%`);
  }

  const { data, error } = await query.returns<Exercise[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export function useExercises(search: string, filters: ExerciseFilters) {
  const query = useInfiniteQuery({
    queryKey: ["exercises", search, filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchExercises({
        pageParam,
        search,
        filters,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }

      return allPages.length;
    },
  });

  const exercises = query.data?.pages.flat() ?? [];

  return {
    exercises,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
    loadMore: query.fetchNextPage,
    hasMore: query.hasNextPage,
  };
}