import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { Fonts, Kinetic } from "@/constants/theme";

type ExerciseSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function ExerciseSearchInput({ value, onChangeText }: ExerciseSearchInputProps) {
  return (
    <View style={styles.container}>
      <Feather color={Kinetic.textFaint} name="search" size={20} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder="Search exercises"
        placeholderTextColor={Kinetic.textFaint}
        selectionColor={Kinetic.accentPrimary}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#232323",
    borderColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  input: {
    color: Kinetic.white,
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 19,
    padding: 0,
  },
});
