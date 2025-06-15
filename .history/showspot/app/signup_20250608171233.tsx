import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase'; // assumes you created this
import { useRouter } from 'expo-router';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error(error);
      router.push('/failure');
    } else {
      router.push({
        pathname: '/success',
        params: { name: fullName },
      });
    }
  };

  return (
    <SafeAreaView style={styles.signUp}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Sign Up for ShowSpot</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.buttonOutline} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <LinearGradient
            colors={['#ff00ff', '#2a2882']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Log In</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signUp: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Amiko-Regular',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: 'Amiko-Regular',
    backgroundColor: '#f4f4f4',
  },
  buttonOutline: {
    borderColor: '#ff00ff',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Amiko-Regular',
    fontSize: 16,
  },
});

export default SignUp;
