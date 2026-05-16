import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

type FormValues = {
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
  const { handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: { selected: filters[filterType] },
  });

  const selected = watch("selected");

  useEffect(() => {
    reset({ selected: filters[filterType] });
  }, [filters, filterType, reset]);

  const title =
    filterType === "target_muscle" ? "TARGET MUSCLE" : filterType.toUpperCase();

  const applyFilter = ({ selected }: FormValues) => {
    onApply({ ...filters, [filterType]: selected });
    onClose();
  };

  const values = [null, ...options];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#aaa" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.optionsList}
            keyboardShouldPersistTaps="always"
          >
            {values.map((option) => {
              const active = selected === option;
              const label = option ?? "All";

              return (
                <Pressable
                  key={label}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => setValue("selected", option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      active && styles.optionTextActive,
                    ]}
                  >
                    {label}
                  </Text>

                  {active && (
                    <Ionicons name="checkmark" size={18} color="#C8FF00" />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleSubmit(applyFilter)}
          >
            <Text style={styles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
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