import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { messagesAPI } from "../services/api";

const RoomsScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await messagesAPI.getRooms();
      setRooms(response.data.data.rooms || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load rooms");
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewRoom = () => {
    const newRoomId = `room_${Date.now()}`;
    navigation.navigate("Chat", { roomId: newRoomId });
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate("Chat", { roomId: item })}
    >
      <Text style={styles.roomName}>{item}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading rooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newRoomButton} onPress={createNewRoom}>
        <Text style={styles.newRoomText}>Create New Room</Text>
      </TouchableOpacity>

      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item}
        style={styles.roomsList}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No rooms yet. Create your first room!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: 320, // <-- Fix here
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newRoomButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  newRoomText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  roomsList: {
    // flex: 1,
  },
  roomItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default RoomsScreen;
