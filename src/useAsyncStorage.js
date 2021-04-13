// https://stackoverflow.com/a/63434489

import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState();

  async function getStoredItem(key, initialValue) {
    try {
      // Get from local storage by key
      const item = await AsyncStorage.getItem(key);
      console.log(item);
      // Parse stored json or if none return initialValue
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      // If error also return initialValue
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("get value", key, initialValue);
    getStoredItem(key, initialValue);
  }, [key, initialValue]);

  const setValue = async (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// example usage
function App() {
  // Similar to useState but first arg is key to the value in local storage.
  const [name, setName] = useAsyncStorage("name", "Bob");
  const [email, setEmail] = useAsyncStorage("email", "yajananrao@gmail.com");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        margin: 12,
      }}
    >
      <Text style={{ margin: 12 }}>{name}</Text>
      <Button title="Update Name" onPress={() => setName("Test String")} />
      <Text style={{ margin: 12 }}>{email}</Text>
      <Button title="Update Email" onPress={() => setEmail("Test String")} />
    </View>
  );
}

export default useAsyncStorage;
