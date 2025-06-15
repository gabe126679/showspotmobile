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
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (loading) return;
    if (!fullName || !email || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Sign up user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        console.error('Signup Error:', signUpError);
        Alert.alert('Signup Failed', signUpError.message);
        return navigation.navigate('Failure');
      }

      // Step 2: Wait for session to be available
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('Session Error:', sessionError);
        Alert.alert('Session Error', sessionError?.message || 'No session available');
        return navigation.navigate('Failure');
      }

      const user = sessionData.session.user;
      let imageUrl: string | null = null;

      // Step 3: Upload profile picture if selected
      if (image) {
        const fileExt = image.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `spotter-profile-pictures/${fileName}`;

        const response = await fetch(image);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('spotter-profile-pictures')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
          });

        if (uploadError) {
          console.error('Image Upload Error:', uploadError);
          Alert.alert('Upload Failed', 'Unable to upload profile picture.');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('spotter-profile-pictures')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Step 4: Insert into spotters table
      const { error: insertError } = await supabase.from('spotters').insert([
        {
          id: user.id,
          full_name: fullName,
          email,
          spotter_profile_picture: imageUrl,
        },
      ]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        Alert.alert('Insert Failed', insertError.message);
        return navigation.navigate('Failure');
      }

      navigation.navigate('Success', { name: fullName });

    } catch (err) {
      console.error('Unexpected Error:', err);
      Alert.alert('Unexpected Error', 'Something went wrong.');
      navigation.navigate('Failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.signUp}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: '#888' }}>Tap to select a profile picture</Text>
          </View>
        )}
      </TouchableOpacity>

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
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Continue'}</Text>
      </TouchableOpacity>

      <LinearGradient style={styles.loginLink} colors={['#ff00ff', '#2a2882']}>
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
  profileImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
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
