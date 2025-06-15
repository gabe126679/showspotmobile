import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import { supabase } from '../lib/supabase';

type RootStackParamList = {
  Success: { name?: string };
  Welcome: undefined;
};

type SuccessScreenRouteParams = {
  Success: { name?: string };
};

export default function Success() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<SuccessScreenRouteParams, 'Success'>>();
  const passedName = route.params?.name;
  const [name, setName] = useState<string | undefined>(passedName);
  const [loading, setLoading] = useState(!passedName);
  const [signingOut, setSigningOut] = useState(false);

  // Fetch name from Supabase if not passed via route
  useEffect(() => {
    const fetchName = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          throw new Error('No active session');
        }

        const { data, error } = await supabase
          .from('spotters')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        if (error || !data?.full_name) {
          throw error || new Error('Name not found');
        }

        setName(data.full_name);
      } catch (err) {
        console.error('Name fetch failed:', err);
        setName(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!passedName) {
      fetchName();
    }
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (err: any) {
      Alert.alert('Sign Out Error', err.message || 'Something went wrong');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff00ff" />
      ) : (
        <>
          <Text style={styles.title}>Welcome, {name || 'Spotter'}! 🎉</Text>
          <Text style={styles.message}>Your account was successfully created.</Text>

          <TouchableOpacity style={styles.button} onPress={handleSignOut} disabled={signingOut}>
            <Text style={styles.buttonText}>
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Amiko-Regular',
    color: '#000',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Amiko-Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ff00ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Amiko-Regular',
  },
});
