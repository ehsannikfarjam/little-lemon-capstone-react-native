import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils';

const Profile = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
    image: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setProfile(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!validateEmail(profile.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Onboarding');
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.avatarContainer}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile.firstName[0]}{profile.lastName ? profile.lastName[0] : ''}
              </Text>
            </View>
          )}
          <Pressable style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
          </Pressable>
          <Pressable style={styles.removeBtn} onPress={() => updateProfile('image', null)}>
            <Text style={styles.removeBtnText}>Remove</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={profile.firstName}
          onChangeText={(v) => updateProfile('firstName', v)}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={profile.lastName}
          onChangeText={(v) => updateProfile('lastName', v)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(v) => updateProfile('email', v)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={profile.phoneNumber}
          onChangeText={(v) => updateProfile('phoneNumber', v)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.notifications}>
        <Text style={styles.sectionTitle}>Email Notifications</Text>
        {[
          { key: 'orderStatuses', label: 'Order Statuses' },
          { key: 'passwordChanges', label: 'Password Changes' },
          { key: 'specialOffers', label: 'Special Offers' },
          { key: 'newsletter', label: 'Newsletter' },
        ].map((item) => (
          <Pressable
            key={item.key}
            style={styles.checkboxContainer}
            onPress={() => updateProfile(item.key, !profile[item.key])}
          >
            <View style={[styles.checkbox, profile[item.key] && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Log out</Text>
      </Pressable>

      <View style={styles.footer}>
        <Pressable style={styles.discardBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.discardBtnText}>Discard changes</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333333',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#62D1C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  changeBtn: {
    backgroundColor: '#495E57',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 15,
  },
  changeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: '#495E57',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 15,
  },
  removeBtnText: {
    color: '#495E57',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#495E57',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  notifications: {
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#495E57',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#495E57',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  logoutBtn: {
    backgroundColor: '#F4CE14',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#EE9972',
  },
  logoutBtnText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  discardBtn: {
    borderWidth: 1,
    borderColor: '#495E57',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  discardBtnText: {
    color: '#495E57',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#495E57',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Profile;
