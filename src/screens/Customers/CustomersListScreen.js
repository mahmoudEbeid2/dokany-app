import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { sellerAPI } from "../../utils/api/api";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomersListScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          const response = await sellerAPI.get("/api/seller/customers");
          const fetchedCustomers = response.data || [];
          setCustomers(fetchedCustomers);
          // Set filtered customers here as well to reflect the latest fetch
          setFilteredCustomers(fetchedCustomers);
        } catch (error) {
          console.error("Failed to fetch customers:", error);
          Alert.alert("Error", "Failed to fetch customers from the server.");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        `${customer.f_name} ${customer.l_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const renderCustomerItem = ({ item }) => {
    const imageSource = item.profile_imge
      ? { uri: item.profile_imge }
      : require("../../../assets/CustomerImage.png");

    return (
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() =>
          navigation.navigate("CustomerDetails", { customer: item })
        }
      >
        <Image source={imageSource} style={styles.avatar} />
        <View style={styles.customerInfo}>
          <Text
            style={styles.customerName}
          >{`${item.f_name} ${item.l_name}`}</Text>
          <Text style={styles.customerRegistered}>@{item.user_name}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#C0C0C0" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Customers</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingInline: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#7569FA",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  customerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  customerRegistered: {
    fontSize: 14,
    color: "#665491",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
    backgroundColor: "#7569FA",
    padding: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CustomersListScreen;
