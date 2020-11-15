import React from "react";
import { View, Platform, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles";
import { ESLintCompatibleStatusBar as StatusBar } from "./ESLintCompatibleStatusBar";

export const ScreenView = (props) => {
  const colorScheme = useColorScheme();
  const { theme = colorScheme === "dark" ? DarkTheme : DefaultTheme } = {
    props,
  };
  if (Platform.OS === "web") {
    return (
      <PaperProvider theme={theme}>
        <StatusBar barStyle="auto" />
        <View style={props.style}>{props.children}</View>;
      </PaperProvider>
    );
  } else {
    return (
      <PaperProvider theme={theme}>
        <StatusBar barStyle="auto" />
        <SafeAreaView
          style={[
            { backgroundColor: theme.colors.background },
            styles.container,
            props.style,
          ]}
          edges={["right", "left", "top"]}
        >
          {props.children}
        </SafeAreaView>
      </PaperProvider>
    );
  }
};
