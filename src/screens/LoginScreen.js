import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api";

const LoginScreen = ({ navigation, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && !formData.username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = isLogin
        ? await authAPI.login(formData.email, formData.password)
        : await authAPI.register(
            formData.username,
            formData.email,
            formData.password
          );

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );

      onLogin();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={styles.switchButton}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
justifyContent:"center",
    width: 320,
  
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default LoginScreen;
