// venueSignup.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';

const VenueSignup = () => {
  const navigation = useNavigation();
  const [venueName, setVenueName] = useState('');
  const [venueOwner, setVenueOwner] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueMaxCap, setVenueMaxCap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVenueSubmit = async () => {
    if (!venueName || !venueOwner || !venueAddress || !venueMaxCap) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('No user session found');

      const { data, error } = await supabase
        .from('venues')
        .insert([
          {
            spotterID: user.id,
            venueName,
            venueOwner,
            venueAddress,
            venueMaxCap,
            venueProfileImage: '',
            venueSecondaryImages: [],
          },
        ])
        .select();

      if (error || !data || !data[0]) throw error;

      const venueID = data[0].venueID;
      const { error: updateError } = await supabase
        .from('spotters')
        .update({ isVenue: true, venueID })
        .eq('id', user.id);

      if (updateError) throw updateError;

      navigation.navigate('VenuePicture', { venueID });
    } catch (err) {
      console.error('Venue Signup Error:', err);
      Alert.alert('Error', 'Could not create venue profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Create Your Venue Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Venue Name"
            placeholderTextColor="#b4b3b3"
            value={venueName}
            onChangeText={setVenueName}
          />

          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="#b4b3b3"
            value={venueOwner}
            onChangeText={setVenueOwner}
          />

          <TextInput
            style={styles.input}
            placeholder="Venue Address"
            placeholderTextColor="#b4b3b3"
            value={venueAddress}
            onChangeText={setVenueAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Maximum Capacity"
            placeholderTextColor="#b4b3b3"
            keyboardType="numeric"
            value={venueMaxCap}
            onChangeText={setVenueMaxCap}
          />

          <TouchableOpacity
            style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
            onPress={handleVenueSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Continue'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
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
});

export default VenueSignup;
