import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { sellerAPI } from "../../utils/api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { customer } = route.params;

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await sellerAPI.delete(`/api/seller/customers/${customer.id}`);
              Alert.alert("Success", "Customer deleted successfully.");
              navigation.goBack();
            } catch (error) {
              console.error(
                "Failed to delete customer:",
                error.response?.data || error.message
              );
              Alert.alert(
                "Error",
                "Failed to delete customer. You may not have permission."
              );
            }
          },
        },
      ]
    );
  };

  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Customer not found.</Text>
      </SafeAreaView>
    );
  }

  const imageSource = customer.profile_imge
    ? { uri: customer.profile_imge }
    : require("../../../assets/CustomerImage.png");

  return (
    <SafeAreaView style={styles.detailsContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Customer Details</Text>

        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <Image source={imageSource} style={styles.detailsAvatar} />
        <View style={styles.detailsContent}>
          <Text
            style={styles.detailsName}
          >{`${customer.f_name} ${customer.l_name}`}</Text>
          <Text style={styles.detailsEmail}>{customer.email}</Text>
          {/* <Text style={styles.detailsId}>Customer ID: {customer.id}</Text> */}
          <View style={styles.detailsInfoRow}>
            <View style={styles.detailsInfoBlock}>
              <Text style={styles.detailsInfoTitle}>Phone</Text>
              <Text style={styles.detailsInfoText}>{customer.phone}</Text>
            </View>
            <View style={styles.detailsInfoBlock}>
              <Text style={styles.detailsInfoTitle}>City</Text>
              <Text style={styles.detailsInfoText}>
                {customer.city || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.detailsInfoRow}>
            <View style={styles.detailsInfoBlock}>
              <Text style={styles.detailsInfoTitle}>Governorate</Text>
              <Text style={styles.detailsInfoText}>{customer.governorate}</Text>
            </View>
            <View style={styles.detailsInfoBlock}>
              <Text style={styles.detailsInfoTitle}>Country</Text>
              <Text style={styles.detailsInfoText}>
                {customer.country || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.detailsFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditCustomer", { customer })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    textAlign: "center",
    marginTop: 40,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  detailsAvatar: {
    padding: 10,
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  detailsContent: {
    padding: 10,
  },
  detailsName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginTop: 10,
  },
  detailsEmail: {
    fontSize: 14,
    color: "#665491",
    marginTop: 4,
    fontWeight: "bold",
  },

  detailsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  detailsInfoBlock: {
    flex: 1,
  },
  detailsInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  detailsInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#665491",
  },
  detailsFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 20,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  editButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "red",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomerDetailsScreen;
