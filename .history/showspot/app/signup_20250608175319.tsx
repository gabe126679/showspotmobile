import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignUp = ({ navigation }: Props) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleSignUp = async () => {
  if (loading) return;

  if (!fullName || !email || !password) {
    Alert.alert('Missing Info', 'Please fill in all fields');
    return;
  }

  try {
    setLoading(true);

    // Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      console.error('Signup Error:', signUpError);
      Alert.alert('Signup Failed', signUpError.message);
      navigation.navigate('Failure');
      return;
    }

    console.log('Signup Data:', signUpData);

    // Get session
    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error('Session Error:', sessionError);
      Alert.alert('Auth Error', sessionError?.message || 'No active session');
      navigation.navigate('Failure');
      return;
    }

    const user = sessionData.session.user;
    console.log('Session User:', user);

    // Insert into spotters
    const { error: insertError } = await supabase.from('spotters').insert([
      {
        id: user.id,
        full_name: fullName,
        email,
      },
    ]);

    if (insertError) {
      console.error('Insert Error:', insertError);
      Alert.alert('Insert Failed', insertError.message);
      navigation.navigate('Failure');
      return;
    }

    navigation.navigate('Success', { name: fullName });

  } catch (err) {
    console.error('Unexpected Error:', err);
    Alert.alert('Error', 'An unexpected error occurred');
    navigation.navigate('Failure');
  } finally {
    setLoading(false);
  }
};



  return (
    <SafeAreaView style={styles.signUp}>
      <Image
        style={styles.logo}
        resizeMode="cover"
        source={require('../assets/showspotlogo.png')}
      />
      <Text style={styles.title}>Sign up for ShowSpot</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        placeholderTextColor="#b4b3b3"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#b4b3b3"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#b4b3b3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <LinearGradient
        style={styles.loginLink}
        colors={['#ff00ff', '#2a2882']}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUp: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 100,
    borderRadius: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Amiko-Regular',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f4f4f4',
    borderColor: '#fafafa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: 'Amiko-Regular',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ff00ff',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontFamily: 'Amiko-Regular',
  },
  loginLink: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Amiko-Regular',
    textAlign: 'center',
  },
});

export default SignUp;
