import { useAddExercise } from "@/hooks/use-add-exercise";
import { useRemoveExercise } from "@/hooks/use-remove-exercise";
import { useUpdateExercise } from "@/hooks/use-update-exercise";
import { Plan } from "@/types/plan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import  { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import PlanExercises, { PendingExercise } from "./plan-exercises";
import ImageSection from "./planform-components/image-section";
import PlaninputForm, {PlaninputFormDifficulty,} from "./planform-components/plan-input";
import Header from "./ui/header";

type Props = {
  initialValues?: Omit<Plan, "user_id">;
  planId?: number;
  exercises?: PendingExercise[];
  submitLabel: string;
  onSubmit: (data: Omit<Plan, "user_id">) => void;
  onExercisesChange?: (exercises: PendingExercise[]) => void;
  onDelete?: () => void;
  disabled?: boolean;
  selectedImage?: string | null;
  onPickImage?: () => void;
};

export default function PlanForm({
                                   initialValues,
                                   planId,
                                   exercises,
                                   submitLabel,
                                   onSubmit,
                                   onExercisesChange,
                                   onDelete,
                                   disabled = false,
                                   selectedImage,
                                   onPickImage,
                                 }: Props) {
  const [form, setForm] = useState<Omit<Plan, "user_id">>({
    name: "",
    difficulty: "Easy",
    duration_minutes: 0,
  });

  const FORM_KEY = "PlanForm.data";

  useEffect(() => {
    AsyncStorage.getItem(FORM_KEY)
        .then((saved) => {
          if (saved) {
            setForm(JSON.parse(saved));
          } else if (initialValues) {
            setForm(initialValues);
          }
        })
        .catch(console.error);
  }, [initialValues]);

  useEffect(() => {
    AsyncStorage.setItem(FORM_KEY, JSON.stringify(form)).catch(console.error);
  }, [form]);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const { addExercise } = useAddExercise({ planId, form });
  const { removeExercise } = useRemoveExercise({
    exercises,
    onExercisesChange,
  });
  const { updateExercise } = useUpdateExercise({
    exercises,
    onExercisesChange,
  });

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
                onChange={(val) => handleChange("name", val)}
            />

            <PlaninputFormDifficulty
                lable="DIFFICULTY"
                inputtype="difficulty"
                value={form.difficulty}
                onChange={(val) => handleChange("difficulty", val)}
            />

            <PlaninputForm
                lable="DURATION (MINUTES)"
                inputtype="duration_minutes"
                value={form.duration_minutes}
                onChange={(val) => handleChange("duration_minutes", val)}
                leftsidetext="MIN"
                placeholder="60"
            />

            <PlanExercises
                exercises={exercises}
                onAdd={addExercise}
                onRemove={removeExercise}
                onChange={updateExercise}
            />
            {onPickImage && (
                <View style={styles.imagePickerSection}>
                  {selectedImage && (
                      <Image
                          source={{ uri: selectedImage }}
                          style={styles.previewImage}
                      />
                  )}

                  <TouchableOpacity
                      style={styles.pickImageBtn}
                      onPress={onPickImage}
                      disabled={disabled}
                  >
                    <Text style={styles.pickImageText}>
                      {selectedImage ? "Change Plan Image" : "Pick Plan Image"}
                    </Text>
                  </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                onPress={() => onSubmit(form)}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.7}
            >
              <LinearGradient
                  colors={disabled ? ["#555", "#666"] : ["#eff8c6", "#ccff00"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.saveButton, disabled && styles.saveButtonDisabled]}
              >
                <Text style={[styles.saveText, disabled && { opacity: 0.7 }]}>
                  {submitLabel}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
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
    paddingTop: 10,
  },

  imagePickerSection: {
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickImageBtn: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickImageText: {
    color: '#cefc22',
    fontWeight: 'bold',
    fontSize: 16,
  },

  saveButton: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },

  saveButtonDisabled: {
    opacity: 0.6,
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
  },

  deleteText: {
    color: "#ff6767",
    fontWeight: "bold",
  },
});