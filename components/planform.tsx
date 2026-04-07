import { Plan } from "@/types/plan";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PlanExercises from "./plan-exercises";


type Props = {
  initialValues?: Omit<Plan, "user_id">;
  submitLabel: string;
  onSubmit: (data: Omit<Plan, "user_id">) => void;
  onDelete?: () => void;
};

const difficulties = ["Easy", "Medium", "Hard", "Extreme"];

export default function PlanForm({
  initialValues,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Omit<Plan, "user_id">>({
    name: "",
    difficulty: "Easy",
    duration_minutes: 0,

  });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  const handleChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
 
  };

  const removeExercise = () => {
 
  };

  const updateExercise = () => {
 
  };



  return (
    <View style={styles.screen}>

      <View>

        <ImageBackground
          source={require("@/assets/images/create-plan-background.png")}
          style={styles.header}
          imageStyle={styles.headerImageRadius}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.smallTitle}>NEW ROUTINE</Text>
            <Text style={styles.bigTitle}>
              UNLEASH{"\n"}POTENTIAL
            </Text>
          </View>
        </ImageBackground>


        <View style={styles.form}>

          <Text style={styles.label}>PLAN NAME</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Full Body Workout"
              placeholderTextColor="#777"
              value={form.name}
              onChangeText={(t) => handleChange("name", t)}
            />

            <View style={styles.inputBottomGlow} />
          </View>


          <Text style={styles.label}>DIFFICULTY</Text>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.inputText}>{form.difficulty}</Text>
              <Ionicons name="chevron-down" size={18} color="#aaa" />
            </TouchableOpacity>

            <Modal transparent visible={dropdownVisible} animationType="fade">
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setDropdownVisible(false)}
              >
                <View style={styles.dropdown}>
                  {difficulties.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleChange("difficulty", level);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Pressable>
            </Modal>
            <View style={styles.inputBottomGlow} />
          </View>


          <Text style={styles.label}>DURATION (MINUTES)</Text>

          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={{ flex: 1, color: "#fff" }}
                placeholder="e.g., 60"
                placeholderTextColor="#777"
                keyboardType="numeric"
                value={String(form.duration_minutes)}
                onChangeText={(t) =>
                  handleChange("duration_minutes", Number(t))
                }
              />
              <Text style={styles.minText}>MIN</Text>
            </View>
            <View style={styles.inputBottomGlow} />
          </View>


          <PlanExercises
            
            onAdd={addExercise}
            onRemove={removeExercise}
            onChange={updateExercise}
          />


          <TouchableOpacity onPress={() => onSubmit(form)}>
            <LinearGradient
              colors={["#eaff3b", "#ccff00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>{submitLabel}</Text>
            </LinearGradient>
          </TouchableOpacity>


          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
            >
              <Text style={styles.deleteText}>DELETE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#121212",
  },

  header: {
    height: 220,
    width: "100%",
    justifyContent: "flex-end",
  },

  headerImageRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerOverlay: {
    padding: 18,
  },

  smallTitle: {
    color: "#ccff00",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
  },

  bigTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 30,
    marginTop: 4,
  },


  form: {
    paddingTop: 18,
  },

  label: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 18,
    marginBottom: 6,
    marginLeft: 4,
    letterSpacing: 1,
  },

  input: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 14,
    color: "#fff",
  },

  inputRow: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputText: {
    color: "#fff",
  },

  minText: {
    color: "#888",
    fontSize: 12,
  },


  saveButton: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },

  saveText: {
    color: "#0a0a0a",
    fontWeight: "800",
    letterSpacing: 2,
  },

  deleteButton: {
    marginTop: 18,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 14,
    borderColor: "#ff67679a",
    paddingVertical: 18,
    letterSpacing: 1,
  },

  deleteText: {
    color: "#ff6767",
    fontWeight: "bold",

  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 40,
  },

  dropdown: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
  },

  dropdownItem: {
    padding: 16,
  },

  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },

  inputWrapper: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },

  inputBottomGlow: {
    height: 2,
    backgroundColor: "rgb(255, 255, 255)",
  },
});