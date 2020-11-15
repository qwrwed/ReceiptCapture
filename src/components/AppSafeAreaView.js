import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AppSafeAreaView = (props) => {
  if (Platform.OS === "web") {
    return <View style={props.style}>{props.children}</View>;
  } else {
    return (
      <SafeAreaView style={props.style} edges={["right", "left", "top"]}>
        {props.children}
      </SafeAreaView>
    );
  }
};