import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function Success() {
  const { fullName } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>🎉 Welcome to ShowSpot, {fullName}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#222",
  },
});
