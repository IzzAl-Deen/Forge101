import React, { useState, useEffect } from "react";
import {View, Text, TextInput, Button, StyleSheet} from "react-native";
import { Plan } from "@/types/plan";

type Props = {
  initialValues?: Omit<Plan, "user_id">;
  submitLabel: string;
  onSubmit: (data: Omit<Plan, "user_id">) => void;
};

export default function PlanForm({
  initialValues,
  submitLabel,
  onSubmit,
}: Props) {

  const [form, setForm] = useState<Omit<Plan, "user_id">>({
    name: "",
    difficulty: "",
    duration_minutes: 0,
  });

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  const handleChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Plan Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(t) => handleChange("name", t)}
      />

      <Text style={styles.label}>Difficulty</Text>
      <TextInput
        style={styles.input}
        value={form.difficulty}
        onChangeText={(t) => handleChange("difficulty", t)}
      />

      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(form.duration_minutes)}
        onChangeText={(t) =>
          handleChange("duration_minutes", Number(t))
        }
      />

      <Button
        title={submitLabel}
        onPress={() => onSubmit(form)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: "bold", marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
});