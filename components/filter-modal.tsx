import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { ExerciseFilters } from "../types/exercise";

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: ExerciseFilters;
  onApply: (filters: ExerciseFilters) => void;
  filterType: keyof ExerciseFilters;
  options: string[];
};

type FilterForm = {
  selected: string | null;
};

export const FilterModal = ({
  visible,
  onClose,
  filters,
  onApply,
  filterType,
  options,
}: Props) => {
  const { control, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: {
      selected: filters[filterType],
    },
  });

  useEffect(() => {
    reset({
      selected: filters[filterType],
    });
  }, [filters, filterType, reset]);

  const title =
    filterType === "target_muscle"
      ? "TARGET MUSCLE"
      : filterType.toUpperCase();

  const applyFilter = ({ selected }: FilterForm) => {
    onApply({
      ...filters,
      [filterType]: selected,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <Controller
            control={control}
            name="selected"
            render={({ field: { value, onChange } }) => (
              <ScrollView style={styles.optionsList}>
                <TouchableOpacity
                  style={[styles.option, value === null && styles.optionActive]}
                  onPress={() => onChange(null)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === null && styles.optionTextActive,
                    ]}
                  >
                    All
                  </Text>

                  {value === null && (
                    <Ionicons name="checkmark" size={18} color="#C8FF00" />
                  )}
                </TouchableOpacity>

                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      value === option && styles.optionActive,
                    ]}
                    onPress={() => onChange(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option && styles.optionTextActive,
                      ]}
                    >
                      {option}
                    </Text>

                    {value === option && (
                      <Ionicons name="checkmark" size={18} color="#C8FF00" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          />

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleSubmit(applyFilter)}
          >
            <Text style={styles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#141414",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 320,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionActive: {
    backgroundColor: "#1E2A00",
  },
  optionText: {
    color: "#aaa",
    fontSize: 15,
  },
  optionTextActive: {
    color: "#C8FF00",
    fontWeight: "700",
  },
  applyBtn: {
    backgroundColor: "#C8FF00",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  applyBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 2,
  },
});