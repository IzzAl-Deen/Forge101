import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

export const FilterModal = ({
  visible,
  onClose,
  filters,
  onApply,
  filterType,
  options,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(
    filters[filterType]
  );

  useEffect(() => {
    setSelected(filters[filterType]);
  }, [filters, filterType]);

  const handleApply = () => {
    onApply({ ...filters, [filterType]: selected });
    onClose();
  };

  const title =
    filterType === "target_muscle"
      ? "TARGET MUSCLE"
      : filterType.toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <ScrollView style={{ maxHeight: 320 }}>
            <TouchableOpacity
              style={[styles.option, selected === null && styles.optionActive]}
              onPress={() => setSelected(null)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === null && styles.optionTextActive,
                ]}
              >
                All
              </Text>
              {selected === null && (
                <Ionicons name="checkmark" size={18} color="#C8FF00" />
              )}
            </TouchableOpacity>

            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.option, selected === opt && styles.optionActive]}
                onPress={() => setSelected(opt)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === opt && styles.optionTextActive,
                  ]}
                >
                  {opt}
                </Text>
                {selected === opt && (
                  <Ionicons name="checkmark" size={18} color="#C8FF00" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
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