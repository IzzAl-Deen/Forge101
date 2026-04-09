import { Plan } from "@/types/plan";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PlanExercises, { PendingExercise } from "./plan-exercises";
import Exercise from "../api/exerciseApi";
import Header from "./ui/header";
import Plans from "@/api/plansApi";
import ImageSection from "./planform-components/image-section";
import PlaninputForm, { PlaninputFormDifficulty } from "./planform-components/plan-input";

type Props = {
  initialValues?: Omit<Plan, "user_id">;
  planId?: number;
  exercises?: PendingExercise[];
  submitLabel: string;
  onSubmit: (data: Omit<Plan, "user_id">) => void;
  onExercisesChange?: (exercises: PendingExercise[]) => void;
  onDelete?: () => void;
};

export default function PlanForm({initialValues, planId, exercises, submitLabel, onSubmit, onExercisesChange, onDelete,}: Props) {
  const router = useRouter();
  const { selectedExercises,  planName, planDifficulty, planDuration} = useLocalSearchParams<{
    selectedExercises?: string;
    planName?: string;
    planDifficulty?: string;
    planDuration?: string;
  }>();

  const [form, setForm] = useState<Omit<Plan, "user_id">>({
    name: "",
    difficulty: "Easy",
    duration_minutes: 0,
  });

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!planName && !planDifficulty && !planDuration) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      name: planName ?? prev.name,
      difficulty: planDifficulty ?? prev.difficulty,
      duration_minutes: planDuration ? Number(planDuration) : prev.duration_minutes,
    }));
  }, [planDifficulty, planDuration, planName]);

  useEffect(() => {
    if (!selectedExercises || !onExercisesChange) {
      return;
    }

    try {
      const parsedExercises = JSON.parse(selectedExercises);
      onExercisesChange(parsedExercises);
    } catch (error) {
      console.error("Failed to parse selected exercises:", error);
    }
  }, [selectedExercises, onExercisesChange]);

  const handleChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    router.push({
      pathname: "/(private)/exercises/ExercisesScreen",
      params: {
        planId: planId ? String(planId) : "",
        returnTo: planId ? "/(private)/plans/edit/[id]" : "/(private)/plans/create",
        returnId: planId ? String(planId) : "",
        planName: form.name,
        planDifficulty: form.difficulty,
        planDuration: String(form.duration_minutes),
      },
    });
  };

  const removeExercise = (index: number) => {
    if (!exercises || !onExercisesChange) {
      return;
    }

    onExercisesChange(exercises.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateExercise = (
    index: number,
    field: "sets" | "reps",
    value: string,
  ) => {
    if (!exercises || !onExercisesChange) {
      return;
    }

    onExercisesChange(
      exercises.map((exercise, itemIndex) =>
        itemIndex === index ? { ...exercise, [field]: value } : exercise,
      ),
    );
  };

  return (
    <View style={styles.screen}>
      <Header title={initialValues ? "Edit Plan" : "Create Plan"} />

      <View>
        <ImageSection />

        <View style={styles.form}>
          <PlaninputForm
            lable="PLAN NAME"
            inputtype="name"
            value={form.name}
            placeholder="Full Body Workout"
            onChange={(val) => handleChange("name", val)} />

          <PlaninputFormDifficulty
            lable="DIFFICULTY"
            inputtype="difficulty"
            value={form.difficulty}
            onChange={(val) => handleChange("difficulty", val)} />

          <PlaninputForm
            lable="DURATION (MINUTES)"
            inputtype="duration_minutes"
            value={form.duration_minutes}
            onChange={(val) => handleChange("duration_minutes", val)}
            leftsidetext="MIN" placeholder="60" />

          <PlanExercises
            exercises={exercises}
            onAdd={addExercise}
            onRemove={removeExercise}
            onChange={updateExercise}
          />

          <TouchableOpacity onPress={() => onSubmit(form)}>
            <LinearGradient
              colors={["#eff8c6", "#ccff00"]}
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
              <Text style={styles.deleteText}>DELETE PLAN</Text>
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


  form: {
    paddingTop: 18,
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
});
