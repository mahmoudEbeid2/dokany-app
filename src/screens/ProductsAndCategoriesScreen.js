import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // ✅ استيراد أيقونة السهم
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from '../components/ProductScreen';
import CategoriesScreen from '../components/CategoriesScreen';

export default function ProductsAndCategoriesScreen() {
  const [activeTab, setActiveTab] = useState('products');
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('products')}
          style={[styles.tabButton, activeTab === 'products' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeText]}>
            Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('categories')}
          style={[styles.tabButton, activeTab === 'categories' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeText]}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'products' ? <ProductsScreen /> : <CategoriesScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 ,backgroundColor:"#FAFAFA"},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
borderRadius: 20, 
    backgroundColor: '#ddd',
  },
  activeTab: {
backgroundColor: "#7569FA", 
  },
  tabText: {
    color: '#555',
fontSize: 16, 
fontWeight: "bold",   },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  backButton: {
        position: "absolute",
    top: 15,
    left: 20,
    zIndex: 3,
    padding: 8,
    // backgroundColor: "#E8E5F5",
    // borderRadius: 50,
    // alignItems: "center",
    // justifyContent: "center",  
  },

});
