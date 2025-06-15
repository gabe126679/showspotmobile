import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function Success() {
  const { name } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>🎉 Welcome to ShowSpot, {name}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Amiko-Regular',
  },
});
