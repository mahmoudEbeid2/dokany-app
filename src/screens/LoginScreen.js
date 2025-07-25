import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../utils/api/api";
import { AntDesign, Ionicons } from "@expo/vector-icons";




export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authAPI.post("seller/login", { email, password });

      await AsyncStorage.setItem("token", res.data.token);

      alert("Login successful");
      setErrors({});
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      console.error("Login error:", err.message, err.stack);
      setErrors({
        general: err?.response?.data?.error || "Login failed",
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <ScrollView contentContainerStyle={styles.container} >
            <View
              style={styles.navigationContainer}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text
                style={styles.navigationTitle}
              >
                Login
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Login</Text>
              <View>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}><Ionicons name="person" size={20} /></View>
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    style={[styles.input, errors.email && styles.inputError]}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#665491"

                  />
                </View>
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>
              <View >
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}> <Ionicons name="lock-closed" size={20} /></View>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    style={[styles.input, errors.password && styles.inputError]}
                    secureTextEntry
                    placeholderTextColor="#665491"

                  />
                </View>
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              {errors.general && <Text style={styles.error}>{errors.general}</Text>}

              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>
                  Don't have an account?{' '}
                  <Text style={styles.linkBold}>Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 50,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navigationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    marginTop: 10,
    flex: 1,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#7569FA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 5,
    color: "#665491",
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "#665491",
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
    width: 20,
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
    width: "100%",
    textAlign: "start",
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#7569FA",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#665491",
    fontSize: 14,
    marginTop: 18,
  },
  linkBold: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
