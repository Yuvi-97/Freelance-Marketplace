import React, { useRef, useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://<YOUR_BACKEND_URL>/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: emailRef.current,
          password: passwordRef.current,
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        Alert.alert("Login Failed", data.msg || "Invalid credentials");
        return;
      }
      Alert.alert("Success", "Login successful");
      // Navigate to home or dashboard here
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email or Username"
        style={styles.input}
        autoCapitalize="none"
        onChangeText={(text) => (emailRef.current = text)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => (passwordRef.current = text)}
      />
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
});
