import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validateName } from '../utils';

const Onboarding = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validateName(firstName) && validateEmail(email));
  }, [firstName, email]);

  const handleNext = async () => {
    try {
      const user = { firstName, email, isOnboardingCompleted: true };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Let us get to know you</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Jane"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="jane@example.com"
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  header: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
  },
  logo: {
    height: 60,
    width: 200,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#CBD2D1',
  },
  title: {
    fontSize: 24,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'MarkaziText-Medium',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#EDEFEE',
  },
  footer: {
    padding: 40,
    alignItems: 'flex-end',
    backgroundColor: '#EDEFEE',
  },
  button: {
    backgroundColor: '#F4CE14',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
});

export default Onboarding;
