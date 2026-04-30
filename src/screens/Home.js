import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../database';
import { useUpdateEffect } from '../utils';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts', 'drinks'];

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      return json.menu;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        setData(menuItems);

        const savedUser = await AsyncStorage.getItem('user');
        setProfile(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        setData(menuItems);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable onPress={() => navigation.navigate('Profile')}>
          {profile?.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.firstName ? profile.firstName[0] : 'U'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <View style={styles.heroContent}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroDesc}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            source={require('../../assets/hero.png')}
            style={styles.heroImage}
          />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchBarText}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      <View style={styles.delivery}>
        <Text style={styles.deliveryTitle}>ORDER FOR DELIVERY!</Text>
        <FlatList
          horizontal
          data={sections}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleFiltersChange(index)}
              style={[
                styles.filterBtn,
                filterSelections[index] && styles.filterBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filterSelections[index] && styles.filterBtnTextActive,
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          )}
          style={styles.filterList}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <Image
              source={{
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
              }}
              style={styles.itemImage}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    height: 40,
    width: 150,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    right: -80,
    top: -20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#62D1C1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -80,
    top: -20,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  hero: {
    backgroundColor: '#495E57',
    padding: 20,
  },
  heroTitle: {
    fontSize: 48,
    color: '#F4CE14',
    fontFamily: 'MarkaziText-Medium',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroSubtitle: {
    fontSize: 32,
    color: '#EDEFEE',
    fontFamily: 'MarkaziText-Medium',
    marginTop: -10,
  },
  heroDesc: {
    fontSize: 16,
    color: '#EDEFEE',
    marginTop: 10,
    fontFamily: 'Karla-Medium',
  },
  heroImage: {
    width: 120,
    height: 140,
    borderRadius: 16,
    marginLeft: 10,
  },
  searchContainer: {
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
  },
  delivery: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  filterList: {
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: '#EDEFEE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 15,
  },
  filterBtnActive: {
    backgroundColor: '#495E57',
  },
  filterBtnText: {
    color: '#495E57',
    fontWeight: 'bold',
  },
  filterBtnTextActive: {
    color: '#EDEFEE',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  itemDesc: {
    fontSize: 14,
    color: '#495E57',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEFEE',
    marginHorizontal: 20,
  },
});

export default Home;
