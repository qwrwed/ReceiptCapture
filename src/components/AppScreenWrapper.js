import React from "react";
import { useColorScheme, ScrollView } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import { styles } from "../styles";
import { AppSafeAreaView } from "./AppSafeAreaView";
import { AppStatusBar } from "./AppStatusBar";

export const AppScreenWrapper = (props) => {
  const colorScheme = useColorScheme();
  const { theme = colorScheme === "dark" ? DarkTheme : DefaultTheme } = {
    props,
  };

  return (
    <PaperProvider theme={theme}>
      <AppStatusBar barStyle="auto" />
      <AppSafeAreaView
        style={[
          { backgroundColor: theme.colors.background },
          styles.container,
          props.style,
        ]}
      >
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {props.children}
        </ScrollView>
      </AppSafeAreaView>
    </PaperProvider>
  );
};
