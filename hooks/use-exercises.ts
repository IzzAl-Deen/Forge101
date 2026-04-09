import { supabase } from "../lib/supabase";
import { useState, useEffect, useCallback } from "react";
import type { Exercise, ExerciseFilters } from "../types/exercise";

const PAGE_SIZE = 10;

export function useExercises(search: string, filters: ExerciseFilters) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchExercises = useCallback(async (reset = false) => {
    const currentPage = reset ? 0 : page;
    if (!reset && !hasMore) return;

    reset ? setLoading(true) : setLoadingMore(true);

    let query = supabase
      .from("exercises")
      .select("*")
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (search.trim()) {
      query = query.or(
        `name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`
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

    if (!error && data) {
      if (reset) {
        setExercises(data);
        setPage(1);
      } else {
        setExercises((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }
      setHasMore(data.length === PAGE_SIZE);
    }

    reset ? setLoading(false) : setLoadingMore(false);
  }, [search, filters, page, hasMore]);

  useEffect(() => {
    fetchExercises(true);
  }, [search, filters]);

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchExercises(false);
  };

  return { exercises, loading, loadingMore, hasMore, loadMore };
}