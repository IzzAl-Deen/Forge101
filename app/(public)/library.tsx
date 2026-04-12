import { FilterModal } from "@/components/filter-modal";
import { ExerciseCard } from "@/components/exercise-card";
import { useExercises } from "@/hooks/use-exercises";
import { CATEGORIES, DIFFICULTIES, MUSCLES } from "@/types/exercise";
import type { ExerciseFilters } from "@/types/exercise";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LibraryScreen() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ExerciseFilters>({
    target_muscle: null,
    difficulty: null,
    category: null,
  });
  const [activeModal, setActiveModal] = useState<keyof ExerciseFilters | null>(null);

  const { exercises, loading, loadingMore } = useExercises(search, filters);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleApplyFilter = (newFilters: ExerciseFilters) => {
    setFilters(newFilters);
  };

  const FilterChip = ({
    label,
    type,
  }: {
    label: string;
    type: keyof ExerciseFilters;
  }) => {
    const isActive = !!filters[type];
    return (
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => setActiveModal(type)}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {filters[type] ?? label}
        </Text>
        <Ionicons
          name="chevron-down"
          size={13}
          color={isActive ? "#000" : "#aaa"}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="menu" size={24} color="#C8FF00" />
          <Text style={styles.headerTitle}>EXERCISE LIBRARY</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Ionicons name="options-outline" size={22} color="#C8FF00" />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or description"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsRow}>
        <FilterChip label="Target Muscle" type="target_muscle" />
        <FilterChip label="Difficulty" type="difficulty" />
        <FilterChip label="Category" type="category" />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C8FF00" />
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ExerciseCard
              item={item}
           featured={false}
            />
          )}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color="#C8FF00" style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="barbell-outline" size={48} color="#333" />
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      {activeModal && (
        <FilterModal
          visible={true}
          onClose={() => setActiveModal(null)}
          filters={filters}
          onApply={handleApplyFilter}
          filterType={activeModal}
          options={
            activeModal === "target_muscle"
              ? MUSCLES
              : activeModal === "difficulty"
              ? DIFFICULTIES
              : CATEGORIES
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerRight: {
    position: "relative",
    padding: 4,
  },
  filterBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#C8FF00",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "800",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  chipActive: {
    backgroundColor: "#C8FF00",
    borderColor: "#C8FF00",
  },
  chipText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#000",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: "#444",
    fontSize: 15,
    fontWeight: "600",
  },
});