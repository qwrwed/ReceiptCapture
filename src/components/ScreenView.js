import React from "react";
import { View, Platform, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import { styles } from "../styles";
import { ESLintCompatibleStatusBar as StatusBar } from "./ESLintCompatibleStatusBar";
import { AppSafeAreaView as SafeAreaView } from "./SafeAreaView";

export const ScreenView = (props) => {
  const colorScheme = useColorScheme();
  const { theme = colorScheme === "dark" ? DarkTheme : DefaultTheme } = {
    props,
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="auto" />
      <SafeAreaView
        style={[
          { backgroundColor: theme.colors.background },
          styles.container,
          props.style,
        ]}
      >
        {props.children}
      </SafeAreaView>
    </PaperProvider>
  );
};
