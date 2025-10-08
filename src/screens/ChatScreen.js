import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketService from "../services/socket";
import { messagesAPI } from "../services/api";

const ChatScreen = ({ route }) => {
  const { roomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();

    return () => {
      socketService.offReceiveMessage();
    };
  }, []);

  const initializeChat = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      setUser(JSON.parse(userData));
      socketService.connect();
      socketService.joinRoom(roomId);
      socketService.onReceiveMessage(handleNewMessage);
      const response = await messagesAPI.getMessages(roomId);
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const messageData = {
      roomId,
      senderId: user.id,
      text: newMessage.trim(),
    };

    socketService.sendMessage(messageData);
    setNewMessage("");
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender._id === user?.id ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.senderName}>
        {item.sender._id === user?.id ? "You" : item.sender.username}
      </Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 320,
    justifyContent: "center",
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#666",
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  timestamp: {
    fontSize: 10,
    color: "#ccc",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatScreen;
