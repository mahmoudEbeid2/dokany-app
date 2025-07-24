import React, { useEffect, useState ,useCallback} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';


import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";

// { route, navigation }
const ProductDetails = ({ navigation, route}) => {
  // const token = await AsyncStorage.getItem("token");
//   const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZGRmNTVxNzAwMDBzNnlweG5oaThtOGgiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzUzMTIxMjg1LCJleHAiOjE3NTM3MjYwODV9.EjqeiVhVpkBWo3kyJDO5ngPOHzWUAx3_kbis8kxoBxY";
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  //   const { product } = route.params;
  const productId = route.params.productId;

 useFocusEffect (useCallback(() => {
    const fetchProduct = async () => {
        
      try {
        const response = await fetch(
          `${API}/products/${productId}`
        );
        const data = await response.json();
        // console.log("Product:", data);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    const fetchReviews = async () => {
        const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(
          `${API}/reviews/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        // console.log("Reviews:", data);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [])
);
  const handleEdit = () => {
  navigation.navigate("EditProduct", { productId });


    // alert("Edit functionality is under construction.");
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        `${API}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Product deleted successfully!");
        // You can navigate back or refresh list
        navigation.goBack();

      } else {
        const errorData = await res.json();
        Alert.alert(
          "Error",
          `Failed to delete product: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Error", "Error deleting product.");
    }
  };

//   handleDeleteReview
const handleDeleteReview = async (reviewId) => {
  const token = await AsyncStorage.getItem('token');
  try {
    const res = await fetch(
      `${API}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      Alert.alert("Success", "Review deleted successfully!");
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } else {
      const errorData = await res.json();
      Alert.alert(
        "Error",
        `Failed to delete review: ${errorData.message || "Unauthorized or Unknown error"}`
      );
      console.log(res)
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    Alert.alert("Error", "Error deleting review.");
  }
}

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#7B5CFA" />;

  return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: product?.images?.[0].image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.container2}>
        <Text style={styles.name}>{product?.title}</Text>
        {product?.discount ? (
          <View style={styles.flex}>
            <Text style={styles.price}>${product?.price}</Text>
            <Text style={styles.price}>Discount: {product?.discount}</Text>
          </View>
        ) : (
          <Text style={styles.price}>${product?.price}</Text>
        )}
        <Text style={styles.description}>{product?.description}</Text>
        <Text style={styles.category}>
          Category: {product?.category?.name || "N/A"}
        </Text>

        <Text style={styles.status}>
          Status: {product?.status }
        </Text>
        <View style={styles.flex}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit()}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete()}
          >
            <Text style={styles.buttonTextd}>Delete</Text>
          </TouchableOpacity>
          {/* reviews */}
        </View>
        <Text style={[styles.name, { marginTop: 20 }]}>Reviews</Text>

        {reviews?.length > 0 ? (
            
            <View style={styles.reviews}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.flex}>
                <View style={styles.reviewContent}>
                  <Image
                    source={{
                      uri:
                        review?.customer?.profile_imge ||
                        "https://i.pravatar.cc/150?img=12",
                    }}
                    style={styles.reviewImage}
                  />

                  <Text style={styles.reviewName}>
                    {review?.customer?.f_name + " " + review?.customer?.l_name}
                  </Text>
                </View>
                <TouchableOpacity
                style={styles.reviewTextx}
                  onPress={() => {
                    Alert.alert(
                      "Delete Review",
                      "Are you sure you want to delete this review?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          onPress: () => handleDeleteReview(review.id),
                          style: "destructive",
                        },
                      ]
                    );
                }}
                >
                    <AntDesign name="delete" size={20} color="black" />
                </TouchableOpacity>
                
              </View>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <AntDesign
                    key={i}
                    name="star"
                    size={20}
                    color={i < review?.rating ? "#black" : "#ccc"}
                    style={styles.iconStar}
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>{review?.comment}</Text>
            </View>
          ))}
        </View>) : (
          <Text style={styles.noReviews}>No reviews yet</Text>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: 420,
    height: 350,
    // borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: "auto",
  },
  container2: {
    // padding:16,
    paddingHorizontal: 25,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    // textAlign: '',
  },
  price: {
    fontSize: 14,
    marginVertical: 8,
    color: "#665491",
  },
  category: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  seller: {
    fontSize: 16,
    color: "#555",
  },
  status: {
    fontSize: 16,
    color: "green",
  },
  description: {
    marginVertical: 10,
    fontSize: 16,
    color: "#665491",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  editButton: {
    backgroundColor: "#F2F0F5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#7569fa",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#121217",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonTextd: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  reviews: {
    marginTop: 20,
  },
  reviewItem: {
    paddingBottom: 20,
    marginBottom: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewName: {
    fontWeight: "bold",
    marginBottom: 5,
    color:"#333",
    fontSize:16,
  },

  reviewText: {
    color: "#666",
  },
  reviewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewTextx: {
    color: "#121217",
    justifyContent: "flex-start",
    //    flex:1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F2F0F5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconStar: {
    marginHorizontal: 2,
  },
  noReviews: {
    marginTop: 20,
    marginBottom: 100,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
