import { supabase } from "@/lib/supabase";
import type { Exercise, ExerciseFilters } from "@/types/exercise";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

type FetchParams = {
  pageParam: number;
  search: string;
  filters: ExerciseFilters;
};

async function fetchExercises({ pageParam, search, filters }: FetchParams) {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const searchText = search.trim();

  let query = supabase.from("exercises").select("*").range(from, to);

  if (searchText) {
    query = query.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.ilike(key, `%${value}%`);
    }
  });

  const { data, error } = await query.returns<Exercise[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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