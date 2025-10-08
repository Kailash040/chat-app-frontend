import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screens/LoginScreen";
import RoomsScreen from "./src/screens/RoomsScreen";
import ChatScreen from "./src/screens/ChatScreen";
import { Button } from "react-native";
const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return null;
  }
  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen
            name="Rooms"
            component={RoomsScreen}
            options={{

              headerRight: () => (
                <Button
                  title="Logout"
                  onPress={async () => {
                    await AsyncStorage.removeItem("token");
                    setIsLoggedIn(false);
                  }}
                />
              ),
            }}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
