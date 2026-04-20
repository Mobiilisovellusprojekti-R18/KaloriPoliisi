import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomMenu = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const menuItems = [
    { name: 'Home', label: 'Koti' },
    { name: 'AddFood', label: 'Lisää' },
    { name: 'FoodDiary', label: 'Päiväkirja' },
    { name: 'Profile', label: 'Profiili' },
  ];

  return (
    <View style={styles.bottomBar}>
      {menuItems.map((item) => {
        const active = route.name === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.bottomItem, active && styles.activeItem]}
            onPress={() => navigation.navigate(item.name)}
          >
            <Text style={[styles.bottomItemLabel, active && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  activeItem: {
    backgroundColor: '#f0f0f0',
  },
  activeLabel: {
    color: '#007AFF',
  },
});

export default BottomMenu;
